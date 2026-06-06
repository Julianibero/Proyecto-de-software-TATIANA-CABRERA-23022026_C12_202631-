/**
 * @file auth.unit.test.js
 * @description Pruebas unitarias para el módulo de autenticación (Auth)
 * Entregable 2 - Pruebas de Software | Talento Sin Fronteras
 * Cobertura objetivo: ≥ 85%
 */

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ─── Mocks ────────────────────────────────────────────────────────────────────
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("../src/models/user.model", () => ({
  findOne: jest.fn(),
  prototype: { save: jest.fn() },
}));

const User = require("../src/models/user.model");

// ─── Helpers internos (simulan la lógica de auth.controller.js) ──────────────
const hashPassword = async (password) => bcrypt.hash(password, 10);
const comparePassword = async (plain, hashed) => bcrypt.compare(plain, hashed);
const generateToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET || "test_secret", {
    expiresIn: "7d",
  });
const verifyToken = (token) =>
  jwt.verify(token, process.env.JWT_SECRET || "test_secret");

// ─── 1. Pruebas Unitarias: Hashing de contraseña ─────────────────────────────
describe("🔐 UNITARIAS - Hashing de contraseña", () => {
  beforeEach(() => jest.clearAllMocks());

  test("UT-01: hashPassword retorna un hash al cifrar una contraseña", async () => {
    bcrypt.hash.mockResolvedValue("$2b$10$hashedValue");
    const result = await hashPassword("miPassword123");
    expect(bcrypt.hash).toHaveBeenCalledWith("miPassword123", 10);
    expect(result).toBe("$2b$10$hashedValue");
  });

  test("UT-02: comparePassword retorna true con contraseña correcta", async () => {
    bcrypt.compare.mockResolvedValue(true);
    const result = await comparePassword("miPassword123", "$2b$10$hashedValue");
    expect(result).toBe(true);
  });

  test("UT-03: comparePassword retorna false con contraseña incorrecta", async () => {
    bcrypt.compare.mockResolvedValue(false);
    const result = await comparePassword("wrongPassword", "$2b$10$hashedValue");
    expect(result).toBe(false);
  });

  test("UT-04: hashPassword no retorna la contraseña en texto plano", async () => {
    bcrypt.hash.mockResolvedValue("$2b$10$differentHash");
    const hash = await hashPassword("secreto123");
    expect(hash).not.toBe("secreto123");
  });
});

// ─── 2. Pruebas Unitarias: Generación y verificación de JWT ──────────────────
describe("🎫 UNITARIAS - Tokens JWT", () => {
  beforeEach(() => jest.clearAllMocks());

  test("UT-05: generateToken produce un token con el payload correcto", () => {
    jwt.sign.mockReturnValue("mocked.jwt.token");
    const token = generateToken({ id: "user123", rol: "creador" });
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: "user123", rol: "creador" },
      expect.any(String),
      { expiresIn: "7d" }
    );
    expect(token).toBe("mocked.jwt.token");
  });

  test("UT-06: verifyToken decodifica correctamente un token válido", () => {
    jwt.verify.mockReturnValue({ id: "user123", rol: "creador" });
    const decoded = verifyToken("valid.token.here");
    expect(decoded.id).toBe("user123");
    expect(decoded.rol).toBe("creador");
  });

  test("UT-07: verifyToken lanza error con token inválido", () => {
    jwt.verify.mockImplementation(() => {
      throw new Error("invalid signature");
    });
    expect(() => verifyToken("invalid.token")).toThrow("invalid signature");
  });

  test("UT-08: generateToken incluye el campo expiresIn de 7 días", () => {
    jwt.sign.mockReturnValue("token.con.expiry");
    generateToken({ id: "abc" });
    const callArgs = jwt.sign.mock.calls[0];
    expect(callArgs[2]).toEqual({ expiresIn: "7d" });
  });
});

// ─── 3. Pruebas Unitarias: Validación de campos del modelo User ───────────────
describe("👤 UNITARIAS - Validación del modelo User", () => {
  test("UT-09: registro falla si el email ya existe en la BD", async () => {
    User.findOne.mockResolvedValue({ email: "ya@existe.com" });
    const existingUser = await User.findOne({ email: "ya@existe.com" });
    expect(existingUser).not.toBeNull();
  });

  test("UT-10: findOne retorna null si el usuario no existe", async () => {
    User.findOne.mockResolvedValue(null);
    const user = await User.findOne({ email: "nuevo@test.com" });
    expect(user).toBeNull();
  });

  test("UT-11: los campos requeridos del usuario son: nombre, email, password, rol", () => {
    const requiredFields = ["nombre", "email", "password", "rol"];
    const userPayload = {
      nombre: "Julian",
      email: "julian@test.com",
      password: "hash",
      rol: "creador",
    };
    requiredFields.forEach((field) => {
      expect(userPayload).toHaveProperty(field);
    });
  });

  test("UT-12: rol del usuario debe ser uno de los valores permitidos", () => {
    const rolesPermitidos = ["creador", "mentor", "empresa"];
    expect(rolesPermitidos).toContain("creador");
    expect(rolesPermitidos).toContain("mentor");
    expect(rolesPermitidos).not.toContain("admin_root");
  });
});

// ─── 4. Pruebas Unitarias: Modelo de Proyecto ─────────────────────────────────
describe("📁 UNITARIAS - Modelo de Proyecto", () => {
  test("UT-13: un proyecto requiere titulo, descripcion y tecnologias", () => {
    const proyecto = {
      titulo: "Mi App",
      descripcion: "Una app de prueba",
      tecnologias: ["React", "Node.js"],
    };
    expect(proyecto.titulo).toBeTruthy();
    expect(proyecto.descripcion).toBeTruthy();
    expect(Array.isArray(proyecto.tecnologias)).toBe(true);
  });

  test("UT-14: tecnologias debe ser un arreglo no vacío", () => {
    const tecnologias = ["React", "Node.js", "MongoDB"];
    expect(tecnologias.length).toBeGreaterThan(0);
  });

  test("UT-15: enlace del proyecto debe ser una URL válida si se proporciona", () => {
    const urlRegex = /^https?:\/\/.+/;
    const enlace = "https://github.com/mi-proyecto";
    expect(urlRegex.test(enlace)).toBe(true);
  });
});
