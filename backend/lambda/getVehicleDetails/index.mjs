// Ported 1:1 from base44/functions/getVehicleDetails/entry.ts
import { json, getUserFromEvent, getSecrets } from '../_lib/common.mjs';

export const handler = async (event) => {
  try {
    const user = await getUserFromEvent(event);
    if (!user) return json(401, { error: 'Unauthorized' });

    const { registration } = JSON.parse(event.body || '{}');
    if (!registration) return json(400, { error: 'Registration is required' });

    const { IRISH_NCR_API_KEY } = await getSecrets();
    if (!IRISH_NCR_API_KEY) return json(500, { error: 'API key not configured' });

    const ncrResponse = await fetch('https://www.irishncrapi.com/api/vehicledetails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${IRISH_NCR_API_KEY}` },
      body: JSON.stringify({ registration: registration.toUpperCase() }),
    });

    if (!ncrResponse.ok) {
      return json(404, { error: 'Vehicle not found. Please check the registration number.' });
    }

    const ncrData = await ncrResponse.json();
    const vehicleData = {
      make: ncrData.make || '',
      model: ncrData.model || '',
      year: ncrData.year?.toString() || '',
      fuelType: ncrData.fuelType || '',
      transmission: ncrData.transmission || '',
      engineSize: ncrData.engineSize || '',
      bodyType: ncrData.bodyType || '',
      colour: ncrData.colour || '',
      numberOfDoors: ncrData.numberOfDoors?.toString() || '',
      numberOfSeats: ncrData.numberOfSeats?.toString() || '',
      currentCountryOfReg: 'Ireland',
      nctExpiry: ncrData.nctExpiry || '',
    };

    return json(200, { success: true, data: vehicleData });
  } catch (error) {
    return json(500, { error: error.message });
  }
};
