// src/service/statisticsService.js
import axiosInstance from "../axiosConfig";

export const fetchStatistics = async () => {
  const [gender, inventory, donations, events] = await Promise.all([
    axiosInstance.get("/api/statistics/gender-distribution"),
    axiosInstance.get("/api/statistics/blood-inventory"),
    axiosInstance.get("/api/statistics/donations-by-user"),
    axiosInstance.get("/api/statistics/event-performance"),
  ]);

  return {
    gender: gender.data,
    inventory: inventory.data,
    donations: donations.data,
    events: events.data,
  };
};
