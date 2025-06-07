// src/components/PrivateRoute.jsx
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import PropTypes from "prop-types";

const PrivateRoute = ({ children }) => {
  const { authenticated } = useContext(AuthContext);

  return authenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};