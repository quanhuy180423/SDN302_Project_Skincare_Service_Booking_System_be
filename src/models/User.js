import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: Number, required: true },
    staus: { type: Boolean, default: false },
    role: {
      type: String,
      enum: ["guest", "staff", "therapist", "admin"],
      default: "guest",
    },
    permissions: [
      {
        type: String,
        enum: [
          "create_data",
          "edit_data",
          "delete_data",
          "view_data",
          "book_service",
          "manage_bookings",
          "manage_users",
          "manage_services",
          "view_reports",
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Thêm permissions mặc định dựa trên role

// this function only run when update role
userSchema.pre("save", function (next) {
  if (this.isModified("role")) {
    switch (this.role) {
      case "admin":
        this.permissions = [
          "create_data",
          "edit_data",
          "delete_data",
          "view_data",
          "book_service",
          "manage_bookings",
          "manage_users",
          "manage_services",
          "view_reports",
        ];
        break;
      case "staff":
        this.permissions = [
          "view_data",
          "book_service",
          "manage_bookings",
          "view_reports",
        ];
        break;
      case "guest":
        this.permissions = ["view_data", "book_service"];
        break;
    }
  }
  next();
});

userSchema.plugin(require("./plugin/index"));

const User = mongoose.model("user", userSchema);
export default User;
