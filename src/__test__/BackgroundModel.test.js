import * as THREE from "three";
import BackgroundModel from "../canvas/Models/BackgroundModel";
import alphaMap from "../../assets/alphaMap.png";

describe("BackgroundModel", () => {
  const backgroundModel = new BackgroundModel(alphaMap);

  test("defines BackgroundModel method", () => {
    expect(typeof backgroundModel._init).toBe("function");
    expect(typeof backgroundModel._createGeometry).toBe("function");
    expect(typeof backgroundModel._createMaterial).toBe("function");
    expect(typeof backgroundModel._createPoints).toBe("function");
  });

  test("_createMaterial()", () => {
    const createMaterialSpy = jest
      .spyOn(backgroundModel, "_createMaterial")
      .mockImplementation(() => {
        backgroundModel.material = new THREE.PointsMaterial({
          size: 1,
          alphaMap,
          alphaTest: 0.1,
          vertexColors: true,
          transparent: true,
        });
      });
    const result = backgroundModel._createMaterial();

    expect(result).toBeUndefined();
    expect(createMaterialSpy).toHaveBeenCalled();
    expect(createMaterialSpy).toHaveBeenCalledTimes(1);

    expect(backgroundModel.material.alphaMap).toBe(alphaMap);
    expect(backgroundModel.material.size).toBe(1);
    expect(backgroundModel.material.vertexColors).toBe(true);
    expect(backgroundModel.material.transparent).toBe(true);

    createMaterialSpy.mockClear();
  });

  test("_createGeometry()", () => {
    const createGeometrySpy = jest
      .spyOn(backgroundModel, "_createGeometry")
      .mockImplementation(() => {
        backgroundModel.geometry = new THREE.BufferGeometry();
      });
    const result = backgroundModel._createGeometry();

    expect(result).toBeUndefined();
    expect(createGeometrySpy).toHaveBeenCalled();
    expect(createGeometrySpy).toHaveBeenCalledTimes(1);

    createGeometrySpy.mockClear();
  });

  test("_createPoints()", () => {
    const createPointsSpy = jest
      .spyOn(backgroundModel, "_createPoints")
      .mockImplementation(() => {
        const geometry = new THREE.BufferGeometry();
        const material = new THREE.PointsMaterial();

        const points = new THREE.Points(geometry, material);
        const group = new THREE.Group();

        group.add(points);
      });
    const result = backgroundModel._createPoints();

    expect(result).toBeUndefined();
    expect(createPointsSpy).toHaveBeenCalled();
    expect(createPointsSpy).toHaveBeenCalledTimes(1);

    createPointsSpy.mockClear();
  });
});
