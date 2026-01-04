"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOnly = void 0;
const adminOnly = (req, res, next) => {
    const user = req.user;
    if (user && Array.isArray(user.role) && user.role.includes('ADMIN')) {
        next();
    }
    else {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }
};
exports.adminOnly = adminOnly;
