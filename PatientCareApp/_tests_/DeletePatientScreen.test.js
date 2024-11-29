import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import DeletePatientScreen from '../screens/DeletePatientScreen'; // Adjust the import based on your file structure
import axios from 'axios';
import { Alert, NativeModules } from 'react-native';

// Mock axios
jest.mock('axios');

// Mock NativeModules to avoid the error
jest.mock('react-native', () => {
  const originalModule = jest.requireActual('react-native');
  return {
    ...originalModule,
    Alert: {
      alert: jest.fn(),
    },
    NativeModules: {
      ...originalModule.NativeModules,
      SettingsManager: {}, // Mock SettingsManager module
      // Add more modules here if needed
    },
  };
});

describe('DeletePatientScreen', () => {
  const patientId = '1'; // Use the patientId for the test

  it('displays patient details and delete button', async () => {
    // Mock the axios GET request to fetch patient details
    axios.get.mockResolvedValue({
      data: {
        name: 'John Doe',
        age: 45,
        gender: 'Male',
        address: '123 Main St',
        phoneNumber: '555-1234',
      },
    });

    render(
      <DeletePatientScreen
        route={{ params: { patientId } }}
        navigation={{ navigate: jest.fn() }}
      />
    );

    // Wait for the patient details to load and ensure they're displayed
    await waitFor(() => screen.getByText('Name: John Doe'));

    expect(screen.getByText('Name: John Doe')).toBeTruthy();
    expect(screen.getByText('Age: 45')).toBeTruthy();
    expect(screen.getByText('Gender: Male')).toBeTruthy();
    expect(screen.getByText('Address: 123 Main St')).toBeTruthy();
    expect(screen.getByText('Phone: 555-1234')).toBeTruthy();

    // Check if the delete button is displayed
    expect(screen.getByText('Delete Patient')).toBeTruthy();
  });

  it('handles deletion when button is pressed', async () => {
    // Mock the axios DELETE request
    axios.delete.mockResolvedValue({ data: {} });

    render(
      <DeletePatientScreen
        route={{ params: { patientId } }}
        navigation={{ navigate: jest.fn() }}
      />
    );

    // Wait for the patient details to load and ensure they're displayed
    await waitFor(() => screen.getByText('Name: John Doe'));

    // Press the delete button
    fireEvent.press(screen.getByText('Delete Patient'));

    // Confirm alert is called with the correct arguments
    expect(Alert.alert).toHaveBeenCalledWith(
      'Delete Patient',
      'Are you sure you want to delete the patient: John Doe?',
      expect.any(Array) // Check if there are button options
    );

    // Simulate pressing the 'Yes' button on the alert
    const yesButton = screen.getByText('Yes');
    fireEvent.press(yesButton);

    // Ensure axios.delete was called to delete the patient
    expect(axios.delete).toHaveBeenCalledWith('http://10.0.2.2:5000/api/patients/1');
    expect(Alert.alert).toHaveBeenCalledWith('Success', 'Patient deleted successfully');
  });

  it('handles error when deletion fails', async () => {
    // Mock axios DELETE request to return an error
    axios.delete.mockRejectedValue(new Error('Failed to delete patient'));

    render(
      <DeletePatientScreen
        route={{ params: { patientId } }}
        navigation={{ navigate: jest.fn() }}
      />
    );

    // Wait for the patient details to load
    await waitFor(() => screen.getByText('Name: John Doe'));

    // Press the delete button
    fireEvent.press(screen.getByText('Delete Patient'));

    // Confirm alert is called with the correct arguments
    expect(Alert.alert).toHaveBeenCalledWith(
      'Delete Patient',
      'Are you sure you want to delete the patient: John Doe?',
      expect.any(Array) // Check if there are button options
    );

    // Simulate pressing the 'Yes' button on the alert
    const yesButton = screen.getByText('Yes');
    fireEvent.press(yesButton);

    // Ensure the error alert is shown
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Failed to delete patient');
  });
});
