export default class BaseUIDiv {
  name: string;
  newUIDiv: HTMLDivElement;

  canvas: HTMLCanvasElement;

  // Initialize elementMethodsMap as an empty WeakMap
  private static elementMethodsMap = new WeakMap<HTMLDivElement, BaseUIDiv>();

  constructor(name: string) {
    this.name = name;

    this.canvas = document.querySelector("#app canvas") as HTMLCanvasElement;

    this.newUIDiv = document.createElement("div");
    this.newUIDiv.id = name;

    this.newUIDiv.style.cssText = `
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      pointer-events: auto;
      container-type: inline-size;
      user-select: none;
    `;

    this.newUIDiv.addEventListener("mousemove", this.mouseFunction.bind(this));

    window.addEventListener("resize", this.updateUISize.bind(this));

    window.addEventListener(
      "orientationchange",
      this.handleOrientationChange.bind(this)
    );

    // Save a reference to the BaseUIDiv instance in the WeakMap
    BaseUIDiv.elementMethodsMap.set(this.newUIDiv, this);

    this.updateUISize();
  }

  getDiv() {
    return this.newUIDiv;
  }

  updateUISize() {
    window.setTimeout(() => {
      this.newUIDiv.style.height = this.canvas.clientHeight + "px";
      this.newUIDiv.style.width = this.canvas.clientWidth + "px";
    }, 10);
  }

  mouseFunction(event: MouseEvent) {
    const x = event.clientX;
    const y = event.clientY;

    const mouseMoveEvent = new MouseEvent("mousemove", {
      clientX: x,
      clientY: y,
      bubbles: true,
      cancelable: true,
    });
    this.canvas.dispatchEvent(mouseMoveEvent);
  }

  handleOrientationChange() {
    if (screen.orientation.type.startsWith("portrait")) {
      this.updateUISize();
    } else if (screen.orientation.type.startsWith("landscape")) {
      this.updateUISize();
    }
  }

  customRemove() {
    window.removeEventListener("resize", this.updateUISize.bind(this));

    window.removeEventListener(
      "orientationchange",
      this.handleOrientationChange.bind(this)
    );

    this.newUIDiv.remove();
  }

  // Method to get the BaseUIDiv instance from the DOM element
  static getInstance(element: HTMLDivElement): BaseUIDiv | undefined {
    return BaseUIDiv.elementMethodsMap.get(element);
  }
}
