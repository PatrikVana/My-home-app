import express from "express";
import { 
  getPendingRegistrations,
  approveUser,
  rejectUser,
  getUsers,
  changeUserRole,
  updateUserPermissions,
  updateUserAccess,
  updateUserStatus,
  deleteUser
} from "../controllers/adminController.js";
import { authenticate, authorizeRole } from "../middleware/auth.js";

const router = express.Router();

// ✅ Endpointy pro správu uživatelů
router.get("/pending-registrations", authenticate, authorizeRole("superadmin"), getPendingRegistrations);
router.put("/approve/:id", authenticate, authorizeRole("superadmin"), approveUser);
router.delete("/reject/:id", authenticate, authorizeRole("superadmin"), rejectUser);
router.get("/users", authenticate, authorizeRole("superadmin"), getUsers);
router.put("/users/:id/role", authenticate, authorizeRole("superadmin"), changeUserRole);
router.put("/permissions/:id", authenticate, authorizeRole("superadmin"), updateUserPermissions);
router.put("/users/:id/access", authenticate, authorizeRole("superadmin"), updateUserAccess);
router.put("/users/:id/status", authenticate, authorizeRole("superadmin"), updateUserStatus);
router.delete("/users/:id", authenticate, authorizeRole("superadmin"), deleteUser);

export default router;
