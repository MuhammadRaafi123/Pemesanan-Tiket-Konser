import {
  getDashboardData,
} from "../services/dashboard.service.js";

import {
  successResponse,
} from "../utils/apiResponse.js";


export const getDashboard = async (
  req,
  res,
  next
) => {
  try {
    const dashboardData =
      await getDashboardData();

    return successResponse(
      res,
      "Data dashboard berhasil diambil",
      dashboardData
    );
  } catch (error) {
    next(error);
  }
};