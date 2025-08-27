import School from "../Model/SchoolModel.js";

// ✅ Add School (strip extra fields)
export const addSchool = async (req, res) => {
  try {
   
    
    let { name, address, latitude, longitude, ...rest } = req.body;

    // if there are extra fields → reject
    if (Object.keys(rest).length > 0) {
      return res.status(400).json({
        error: "Invalid fields provided",
        extraFields: Object.keys(rest),
      });
    }

    // validate required fields manually
    if (!name || !address || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: "All fields are required: name, address, latitude, longitude" });
    }

    const school = new School({ name, address, latitude, longitude });
    await school.save();

    res.status(201).json({ message: "School added successfully", school });
  } catch (err) {
    console.error("Add School Error:", err);
    res.status(400).json({ error: err.message });
  }
};

// ✅ List Schools (validate query params)
export const listSchools = async (req, res) => {
  try {
    let { latitude, longitude, ...rest } = req.query;

    // reject extra query params
    if (Object.keys(rest).length > 0) {
      return res.status(400).json({
        error: "Invalid query params provided",
        extraParams: Object.keys(rest),
      });
    }

    if (!latitude || !longitude) {
      return res.status(400).json({ error: "Latitude and Longitude are required" });
    }

    const userLat = parseFloat(latitude);
    const userLng = parseFloat(longitude);

    if (isNaN(userLat) || isNaN(userLng)) {
      return res.status(400).json({ error: "Latitude and Longitude must be valid numbers" });
    }

    const schools = await School.find();

    // calculate distance (Haversine formula)
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) *
          Math.cos(lat2 * Math.PI / 180) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    const sortedSchools = schools
      .map((s) => ({
        ...s._doc,
        distance: calculateDistance(userLat, userLng, s.latitude, s.longitude),
      }))
      .sort((a, b) => a.distance - b.distance);

    res.json(sortedSchools);
  } catch (err) {
    console.error("List Schools Error:", err);
    res.status(500).json({ error: err.message });
  }
};
