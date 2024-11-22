// Estimasi waktu pembuatan tas
const estimate = async (req, res) => {
  const { materials, size, additional_features } = req.body;

  if (
    !materials ||
    !Array.isArray(materials) ||
    materials.length === 0 ||
    !size
  ) {
    return res.status(400).json({ error: "Materials and size are required" });
  }

  try {
    // Factor sizes
    const sizeFactors = {
      small: 0.8,
      medium: 1.0,
      large: 1.3,
    };

    if (!sizeFactors[size]) {
      return res.status(400).json({ error: "Invalid size" });
    }

    let totalBaseTimes = {
      preparation: 0,
      cutting: 0,
      sewing: 0,
      finishing: 0,
    };
    let totalComplexity = 0;

    // Iterate through materials and calculate time for each material
    for (let materialName of materials) {
      const materialData = await prismaClient.material.findUnique({
        where: { name: materialName },
      });

      if (!materialData) {
        return res
          .status(404)
          .json({ error: `Material ${materialName} not found` });
      }

      // Base production times
      const baseProductionTime = {
        preparation: 0.5,
        cutting: 1.0,
        sewing: 2.0,
        finishing: 1.0,
      };

      // Accumulate base times for each material
      let baseTimes = {};
      for (let step in baseProductionTime) {
        let time = baseProductionTime[step];
        if (step === "cutting") {
          baseTimes[step] = time * materialData.cutting_time;
        } else if (step === "sewing") {
          baseTimes[step] = time * materialData.sewing_time;
        } else {
          baseTimes[step] = time;
        }
      }

      // Apply size factor for each material
      const sizeFactor = sizeFactors[size];
      for (let step in baseTimes) {
        baseTimes[step] *= sizeFactor;
        totalBaseTimes[step] += baseTimes[step];
      }

      totalComplexity += materialData.complexity;
    }

    // Add time for additional features
    let featureTime = additional_features
      ? additional_features.length * 0.5
      : 0;
    totalBaseTimes["additional_features"] = featureTime;

    // Apply random variation (±10%)
    const variationFactor = Math.random() * (1.1 - 0.9) + 0.9;

    // Total production time
    const totalHours =
      Object.values(totalBaseTimes).reduce((a, b) => a + b, 0) *
      totalComplexity *
      variationFactor;

    // Estimate completion date (Assume 8 working hours per day)
    const workingHoursPerDay = 8;
    const workingDays = Math.ceil(totalHours / workingHoursPerDay);
    const estimatedCompletionDate = new Date();
    estimatedCompletionDate.setDate(
      estimatedCompletionDate.getDate() + workingDays
    );

    // Return the calculated data
    res.json({
      totalHours,
      baseTimes: totalBaseTimes,
      estimatedCompletionDate: estimatedCompletionDate
        .toISOString()
        .split("T")[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error calculating production time" });
  }
};

module.exports = { estimate };
