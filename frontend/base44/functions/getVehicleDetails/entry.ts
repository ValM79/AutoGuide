import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { registration } = await req.json();

    if (!registration) {
      return Response.json({ error: 'Registration is required' }, { status: 400 });
    }

    const apiKey = Deno.env.get('IRISH_NCR_API_KEY');
    if (!apiKey) {
      return Response.json({ error: 'API key not configured' }, { status: 500 });
    }

    // Call Irish NCR API
    const ncrResponse = await fetch('https://www.irishncrapi.com/api/vehicledetails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ registration: registration.toUpperCase() }),
    });

    if (!ncrResponse.ok) {
      return Response.json(
        { error: 'Vehicle not found. Please check the registration number.' },
        { status: 404 }
      );
    }

    const ncrData = await ncrResponse.json();

    // Map NCR response to our format
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

    return Response.json({ success: true, data: vehicleData });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});