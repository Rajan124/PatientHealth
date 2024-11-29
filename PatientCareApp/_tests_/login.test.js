import React from "react";
import { render, fireEvent, screen } from "@testing-library/react-native";
import Login from "../screens/Login";

describe("LoginScreen Component", () => {
  const mockNavigation = {
    navigate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    global.alert = jest.fn(); // Mocking global alert for the tests
  });

  it("renders the login form correctly", () => {
    render(<Login navigation={mockNavigation} />);

    expect(screen.getByPlaceholderText("Email")).toBeTruthy(); // Corrected placeholder
    expect(screen.getByPlaceholderText("Password")).toBeTruthy(); // Corrected placeholder
    expect(screen.getByText("Sign in")).toBeTruthy(); // Corrected button text
  });

  it("displays an alert for invalid login credentials", () => {
    // Mock the global alert function
    const alertMock = jest.spyOn(global, "alert").mockImplementation(() => {});
    render(<Login navigation={mockNavigation} />);
    // Use the correct placeholder texts
    fireEvent.changeText(screen.getByPlaceholderText("Email"), "wrongUser");
    fireEvent.changeText(screen.getByPlaceholderText("Password"), "wrongPass");
    fireEvent.press(screen.getByText("Sign in"));
  
    // Check if the alert was called with the correct message
    expect(alertMock).toHaveBeenCalledWith("Invalid login credentials");
    // Restore the original alert function
    alertMock.mockRestore();
  });

  it("navigates to the 'Main' screen on successful login", () => { 
    render(<Login navigation={mockNavigation} />);

    // Simulate entering correct login credentials
    fireEvent.changeText(screen.getByPlaceholderText("Email"), "test");
    fireEvent.changeText(screen.getByPlaceholderText("Password"), "test");
    fireEvent.press(screen.getByText("Sign in"));

    expect(mockNavigation.navigate).toHaveBeenCalledWith("Main"); // Corrected expected navigation
  });
});
