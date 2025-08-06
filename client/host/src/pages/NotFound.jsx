import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import styles from "../styles/NotFound.module.css";

function NotFound() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!location.state?.notFound) {
      navigate(location.pathname, {
        replace: true,
        state: { notFound: true },
      });
    }
  },  [location, navigate]);
   return <div className={styles.notFound}>404 - Page Not Found</div>;
}

export default NotFound;
