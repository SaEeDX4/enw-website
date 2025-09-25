import request from "supertest";
import app from "../../app.js";
import Senior from "../../models/senior.model.js";
import Volunteer from "../../models/volunteer.model.js";
import SupportRequest from "../../models/supportRequest.model.js";
import VolunteerAssignment from "../../models/volunteerAssignment.model.js";

describe("Complete Workflow Integration", () => {
  it("should handle complete senior support workflow", async () => {
    // Step 1: Senior registers and requests support
    const seniorData = {
      firstName: "Maria",
      lastName: "Petrova",
      email: "maria@example.com",
      phone: "+37060000000",
      age: 78,
      address: "123 Gedimino, Vilnius",
      emergencyContact: "Daughter Anna",
      emergencyPhone: "+37060000001",
      supportNeeds: "SHOPPING", // Uppercase to match enum
      additionalInfo: "Need help with weekly grocery shopping",
      consent: true,
    };

    const seniorResponse = await request(app)
      .post("/api/seniors/support-request")
      .send(seniorData)
      .expect(201);

    const { seniorId, requestId } = seniorResponse.body.data;
    expect(seniorId).toBeDefined();
    expect(requestId).toBeDefined();

    // Step 2: Volunteer registers (adjusted endpoint)
    const volunteerData = {
      firstName: "Jonas",
      lastName: "Kazlauskas",
      email: "jonas@example.com",
      phone: "+37060000002",
      age: 35,
      address: "456 Pilies, Vilnius",
      skills: ["SHOPPING", "TRANSPORTATION"],
      availability: ["weekday-morning", "weekend-afternoon"],
      motivation: "I want to help elderly neighbors in my community",
      emergencyContact: "Wife Ruta",
      emergencyPhone: "+37060000003",
      backgroundCheck: true,
      consent: true,
    };

    // Use the correct volunteer endpoint
    const volunteerResponse = await request(app)
      .post("/api/volunteers") // Or '/api/volunteers/applications' if that's your route
      .send(volunteerData)
      .expect(201);

    const volunteerId =
      volunteerResponse.body.data.volunteerId ||
      volunteerResponse.body.data._id;

    // Step 3: Update support request status
    const statusResponse = await request(app)
      .patch(`/api/seniors/support-request/${requestId}/status`)
      .send({ status: "COMPLETED" })
      .expect(200);

    expect(statusResponse.body.data.status).toBe("COMPLETED");
  });

  // Skip blog tests if blog module not implemented yet
  describe.skip("should handle blog content workflow", () => {
    // Blog tests here when module is ready
  });
});
