import React, { useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { Button, Col, Container, Nav, Navbar, Row } from "react-bootstrap";
import logo from "./assets/psn-logo-large.png";

import {
  RiNewspaperLine,
  RiRadarLine,
  RiBaseStationLine,
  RiFolderUserLine,
  RiLogoutBoxLine,
  RiBriefcaseLine,
  RiBookLine,
} from "react-icons/ri";

import styles from "./styles/NewsFeed.module.css";

function NewsFeed() {
  let navigate = useNavigate();
  const location = useLocation();

  function handleClick(e) {
    navigate("/newsfeed/allaccounts");
  }

  function handleSignOut(e) {
    localStorage.removeItem("psnUserId");
    localStorage.removeItem("psnToken");
    localStorage.removeItem("psnUserFirstName");
    localStorage.removeItem("psnUserLastName");
    localStorage.removeItem("psnUserEmail");
    navigate("/");
  }

  useEffect(() => {
    if (localStorage.getItem("psnToken") === null) {
      navigate("/unauthorized");
    }
  }, [navigate]);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <Container className="pt-3">
      <Row className="mb-3">
        <Col md={4}>
          <Row className="justify-content-center align-items-center">
            <Col md="auto" className="text-sm-start text-center mb-sm-0 mb-3">
              <img src={logo} width="125" alt="logo" />
            </Col>
            <Col className="text-sm-start text-center text-success mb-sm-0 mb-3">
              <h1>SKILLBOOT</h1>
            </Col>
          </Row>
        </Col>
        <Col md={8}>
          <div className="d-flex justify-content-center align-items-center w-100 h-100">
            <Button variant="success" onClick={handleClick} className="px-4 py-2">
              Find More Users
            </Button>
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={4}>
          <Navbar bg="light" expand="lg" className="mb-3 mb-sm-0">
            <Container className={styles.navbarContainer}>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse>
                <Nav className={styles.navContainer}>
                  <Link to="" className={`${styles.navItem} ${isActive("/newsfeed") ? styles.active : ""}`}>
                    <RiNewspaperLine /> Newsfeed
                  </Link>
                  <Link to="jobs" className={`${styles.navItem} ${isActive("/newsfeed/jobs") ? styles.active : ""}`}>
                    <RiBriefcaseLine /> Job Vacancies
                  </Link>
                  <Link to="following" className={`${styles.navItem} ${isActive("/newsfeed/following") ? styles.active : ""}`}>
                    <RiRadarLine /> Following
                  </Link>
                  <Link to="follower" className={`${styles.navItem} ${isActive("/newsfeed/follower") ? styles.active : ""}`}>
                    <RiBaseStationLine /> Followers
                  </Link>
                  <Link to="myprofile" className={`${styles.navItem} ${isActive("/newsfeed/myprofile") ? styles.active : ""}`}>
                    <RiFolderUserLine /> My Posts
                  </Link>
                  <Link to="tutorial" className={`${styles.navItem} ${isActive("/newsfeed/tutorial") ? styles.active : ""}`}>
                    <RiBookLine /> Tutorials
                  </Link>
                  <div className={`${styles.navItem} ${styles.signOutButton}`} onClick={handleSignOut}>
                    <RiLogoutBoxLine /> Sign Out
                  </div>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </Col>
        <Col md={8}>
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
}

export default NewsFeed;
