import request from "supertest";
import mongoose from "mongoose";
import app from "../../app.js";
import Senior from "../../models/senior.model.js";
import SupportRequest from "../../models/supportRequest.model.js";

describe("Seniors API", () => {
  describe("POST /api/seniors/support-request", () => {
    const validData = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "+37060000000",
      age: 75,
      address: "123 Test Street, Vilnius, Lithuania",
      emergencyContact: "Jane Doe",
      emergencyPhone: "+37060000001",
      supportNeeds: "SHOPPING", // Uppercase to match enum
      consent: true,
    };

    it("should create a new senior and support request", async () => {
      const response = await request(app)
        .post("/api/seniors/support-request")
        .send(validData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.seniorId).toBeDefined();
      expect(response.body.data.requestId).toBeDefined();
      expect(response.body.data.status).toBe("PENDING");
    });

    it("should reject duplicate email", async () => {
      await request(app).post("/api/seniors/support-request").send(validData);

      const response = await request(app)
        .post("/api/seniors/support-request")
        .send(validData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/seniors/support-requests", () => {
    beforeEach(async () => {
      const senior = await Senior.create({
        firstName: "Test",
        lastName: "Senior",
        email: "test@example.com",
        phone: "+37060000000",
        age: 75,
        address: "Test Address",
        emergencyContact: "Emergency",
        emergencyPhone: "+37060000001",
        consent: true,
      });

      await SupportRequest.create([
        {
          seniorId: senior._id,
          supportType: "SHOPPING",
          description: "Need groceries",
          status: "PENDING",
        },
      ]);
    });

    it("should return all support requests", async () => {
      const response = await request(app)
        .get("/api/seniors/support-requests")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });
});
