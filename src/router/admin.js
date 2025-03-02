const express = require("express");
import adminController from "../controllers/adminController";
import { checkPermission, checkRole } from "../Middleware/authMiddleware";
import permissionController from "../controllers/permissionController";
import userController from "../controllers/userController";
import blogController from "../controllers/blogController";
const router = express.Router();

router.get("/service/", adminController.getAllServices);
router.get("/service/search/:key", adminController.searchService);
router.get("/service/single/", adminController.getAllSingleServices);
router.get("/service/combo/", adminController.getAllComboServices);
router.get("/service/:id", adminController.getServiceByIdByAdmin);
router.put("/service/:id", adminController.updateStatusByAdmin);

//user
router.get('/users/', userController.getAllUsers);
router.get('/users/getCustomer', userController.getUserByRoleCustomer);
router.get('/users/getStaff', userController.getUserByRoleStaff);
router.get('/users/getTherapist', userController.getUserByRoleTherapist);


//blog
router.get("/blogs/:id", blogController.getBlogById);
router.put("/blogs/:id", blogController.confirmBlog);
router.delete("/blogs/:id", blogController.deleteBlogAdmin);
router.get("/blogs/", blogController.getAllBlogs);


router.get("/blogs/search/:key")
// Permission management routes
router.put("/users/:userId/role",
    checkRole(['admin']),
    checkPermission(['manage_users']),
    permissionController.updateRole
);

// Frontend gửi request với body dạng:
// {
//   "permissions": ["create_post", "edit_post", "delete_post"]
// }


router.post("/users/:userId/permissions",
    checkRole(['admin']),
    checkPermission(['create_data']),
    permissionController.addPermissions
);

router.delete("/users/:userId/permissions",
    checkRole(['admin']),
    checkPermission(['manage_users']),
    permissionController.removePermissions
);

router.get("/permissions",
    checkRole(['admin']),
    permissionController.getAllPermissions
);

router.get("/users/:userId/permissions",
    checkRole(['admin']),
    permissionController.getUserPermissions
);

export default router;
