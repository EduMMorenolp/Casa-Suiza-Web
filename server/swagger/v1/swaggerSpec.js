// swagger/swaggerSpec.js

import info from "./info.js";
import servers from "./servers.js";

// User
import User from "./components/schemas/user/User.js";
import UserLogin from "./components/schemas/user/UserLogin.js";
import UserRegister from "./components/schemas/user/UserRegister.js";
import UserLoginP from "./paths/auth/loginUser.js";
import UserRegisterP from "./paths/auth/registerUser.js";
import logoutUser from "./paths/auth/logoutUser.js";
import getUserById from "./paths/user/getUserById.js";
import updateUser from "./paths/user/updateUser.js";
import deleteUser from "./paths/user/deleteUser.js";

// Admin
import getAllUsersAdmin from "./paths/admin/getAllUsersAdmin.js";
import getUserByIdAdmin from "./paths/admin/getUserByIdAdmin.js";
import updateUserAdmin from "./paths/admin/updateUserAdmin.js";
import deleteUserAdmin from "./paths/admin/deleteUserAdmin.js";
import restoreUserAdmin from "./paths/admin/restoreUserAdmin.js";
import searchUsers from "./paths/admin/searchUsersAdmin.js";

// Ticket y Pagos
import createTicket from "./paths/ticket/createTicket.js";
import createPreference from "./paths/payment/createPreference.js";

// Eventos
import getAllEvents from "./paths/event/getAllEvents.js";
import createEvent from "./paths/event/createEvent.js";
import getEventById from "./paths/event/getEventById.js";
import updateEvent from "./paths/event/updateEvent.js";
import deleteEvent from "./paths/event/deleteEvent.js";

const swaggerSpec = {
  openapi: "3.0.0",
  info,
  servers,
  paths: {
    // Auth
    "/auth/register": UserRegisterP,
    "/auth/login": UserLoginP,
    "/auth/logout": logoutUser,
    // Admin
    "/admin/allusers": getAllUsersAdmin,
    "/admin/users/{id}": getUserByIdAdmin,
    "/admin/search": searchUsers,
    "/admin/users/update/{id}": updateUserAdmin,
    "/admin/users/delete/{id}": deleteUserAdmin,
    "/admin/users/restore/{id}": restoreUserAdmin,
    // Users
    "/user": getUserById,
    "/user/update": updateUser,
    "/user/delete": deleteUser,
    // Ticket
    "/tickets": createTicket,
    // Pagos
    "/create-preference": createPreference,
    // Eventos
    "/events": getAllEvents,
    "/event": createEvent,
    "/events/{id}": getEventById, // GET
    "/events/{id}": updateEvent,  // PUT
    "/events/{id}": deleteEvent,  // DELETE
  },
  components: {
    schemas: {
      User,
      UserLogin,
      UserRegister,
    },
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

export default swaggerSpec;
