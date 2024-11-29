import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import PatientsListScreen from '../screens/PatientsListScreen';

// Mock navigation object
const mockNavigation = {
  navigate: jest.fn(),
};

jest.mock('../api/patients', () => ({
  fetchPatients: jest.fn(() =>
    Promise.resolve([
      { id: '1', name: 'Patient Name' },
      { id: '2', name: 'Another Patient' },
    ])
  ),
}));

describe('PatientsListScreen', () => {
  it('renders correctly', async () => {
    const { findByPlaceholderText, findAllByText } = render(
      <NavigationContainer>
        <PatientsListScreen navigation={mockNavigation} />
      </NavigationContainer>
    );

    // Check that the search input is rendered
    const searchInput = await findByPlaceholderText('Search patients...');
    expect(searchInput).toBeTruthy();

    // Check that the patient names are rendered
    const patients = await findAllByText(/Patient Name|Another Patient/);
    expect(patients.length).toBeGreaterThan(0);
  });

  it('navigates to patient details on item press', async () => {
    const { findByText } = render(
      <NavigationContainer>
        <PatientsListScreen navigation={mockNavigation} />
      </NavigationContainer>
    );

    // Wait for the data to load and find the patient item
    const patientItem = await findByText('Patient Name');
    expect(patientItem).toBeTruthy();

    // Simulate a press on the patient item
    fireEvent.press(patientItem);

    // Assert navigation was triggered with correct parameters
    expect(mockNavigation.navigate).toHaveBeenCalledWith('PatientDetailsScreen', {
      patientId: '1',
    });
  });
});
