import React from "react";
import { Container, Row, Col, Form, FormGroup } from "reactstrap";
import { auth } from "../firebase.config";
import useGetData from "../custom-hooks/useGetData";

const UserPage = () => {
  const user = auth.currentUser;
  const { data: usersData, loading } = useGetData("users");
  return (
    <Container>
      <Row>
        <Col>
          <h1>User Profile</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          {loading ? (
            <h5 className="py-5 text-center fw-bold">Loading.....</h5>
          ) : (
            usersData?.map((item) => {
              if (item.id === user.uid) {
                return (
                  <Form key={item.id}>
                    <FormGroup>
                      <label>Name:</label>
                      <p>
                        {item.SurName} {item.FirstName}
                      </p>
                    </FormGroup>
                    <FormGroup>
                      <label>Email:</label>
                      <p>{item.email}</p>
                    </FormGroup>
                  </Form>
                );
              }
              return null;
            })
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default UserPage;
