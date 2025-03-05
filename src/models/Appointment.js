const { Schema, default: mongoose } = require("mongoose");

const appointmentSchema = new Schema(
  {
    customer: { type: Schema.Types.ObjectId, ref: "user", required: true },
    service: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    therapist: { type: Schema.Types.ObjectId, ref: "user", required: true },
    date: [
      {
        day: { type: Date, required: true },
        time: { type: String, required: true },
      },
    ],
    status: {
      type: String,
      enum: ["pending", "checkin", "completed", "canceled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

appointmentSchema.plugin(require("./plugin/index"));

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
