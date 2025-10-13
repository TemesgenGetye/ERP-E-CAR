import { useCarStore } from "@/store/car";
import { useEffect } from "react";

export function useCarData() {
  const makes = useCarStore((state) => state.makes);
  const cars = useCarStore((state) => state.cars);
  const car = useCarStore((state) => state.car);
  const fetchCarById = useCarStore((state) => state.fetchCarById);
  const models = useCarStore((state) => state.models);
  const isLoading = useCarStore((state) => state.isLoading);
  const error = useCarStore((state) => state.error);
  const fetchMakes = useCarStore((state) => state.fetchMakes);
  const fetchModels = useCarStore((state) => state.fetchModels);
  const postCar = useCarStore((state) => state.postCar);
  const fetchCars = useCarStore((state) => state.fetchCars);
  const fetchFilteredCars = useCarStore((state) => state.fetchFilteredCars);

  useEffect(() => {
    if (makes.length === 0) {
      fetchMakes();
    }
  }, []);

  return {
    cars,
    car,
    makes,
    models,
    isLoading,
    error,
    fetchMakes,
    fetchModels,
    postCar,
    fetchCarById,
    fetchCars,
    fetchFilteredCars,
  };
}
