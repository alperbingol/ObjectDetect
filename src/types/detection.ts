export type Detection = {
  label: string;
  score: number; // 0..1 confidence
  box: { x: number; y: number; w: number; h: number }; // pixel coords of original image
};

export type InferenceResponse = {
  boxes: Detection[];
  image: { width: number; height: number };
};
