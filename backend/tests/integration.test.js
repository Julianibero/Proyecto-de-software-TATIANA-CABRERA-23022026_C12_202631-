const request = require("supertest");
const app = require("../index");

let authToken = "";
let proyectoId = "";

// ─── IT-01: Registro ──────────────────────────────────────────────────────────
describe("🔗 INTEGRACIÓN IT-01: POST /api/auth/register", () => {
  test("Registra un nuevo usuario y retorna 201 con mensaje de éxito", async () => {
    const res = await request(app).post("/api/auth/register").send({
      nombre: "Usuario Integración",
      email: `integracion_${Date.now()}@test.com`,
      password: "Password123!",
      rol: "creador",
    });
    expect([200, 201]).toContain(res.statusCode);
  });

  test("Retorna 400 si faltan campos requeridos", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "incompleto@test.com",
    });
    expect([400, 500]).toContain(res.statusCode);
  });
});

// ─── IT-02: Login ─────────────────────────────────────────────────────────────
describe("🔗 INTEGRACIÓN IT-02: POST /api/auth/login", () => {
  const testEmail = `login_${Date.now()}@test.com`;

  beforeAll(async () => {
    await request(app).post("/api/auth/register").send({
      nombre: "Usuario Login",
      email: testEmail,
      password: "Password123!",
      rol: "creador",
    });
  });

  test("Login exitoso retorna token JWT", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: testEmail,
      password: "Password123!",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    authToken = res.body.token;
  });

  test("Login fallido retorna 400 o 401 con credenciales incorrectas", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: testEmail,
      password: "ContraseñaMala999",
    });
    expect([400, 401]).toContain(res.statusCode);
  });

  test("Login con email no registrado retorna 400, 401 o 404", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "noexiste@nada.com",
      password: "cualquier",
    });
    expect([400, 401, 404]).toContain(res.statusCode);
  });
});

// ─── IT-03: Proyectos ─────────────────────────────────────────────────────────
describe("🔗 INTEGRACIÓN IT-03: /api/proyectos", () => {
  test("GET /api/proyectos lista proyectos sin token → 200", async () => {
    const res = await request(app).get("/api/proyectos");
    expect(res.statusCode).toBe(200);
  });

  test("POST /api/proyectos sin token retorna 401", async () => {
    const res = await request(app).post("/api/proyectos").send({
      titulo: "Sin token",
      descripcion: "No debería crearse",
      tecnologias: ["Vue"],
    });
    expect(res.statusCode).toBe(401);
  });

  test("POST /api/proyectos con token válido → 200 o 201", async () => {
    const res = await request(app)
      .post("/api/proyectos")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        titulo: "Proyecto Integración",
        descripcion: "Proyecto de prueba",
        tecnologias: ["Node.js", "MongoDB"],
        enlace: "https://github.com/test/proyecto",
      });
    expect([200, 201]).toContain(res.statusCode);
    if (res.body._id) proyectoId = res.body._id;
  });
});
