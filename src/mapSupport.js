// maplibre-gl 6 needs WebGL2, module workers and ES2022 syntax in its worker
// (Safari 16.4, Firefox 114, Chrome 94). Test the features, not the user agent.

function hasWebGL2() {
  const gl = document.createElement('canvas').getContext('webgl2');
  if (!gl) return false;
  // free the context: browsers cap how many can be alive at once
  gl.getExtension('WEBGL_lose_context')?.loseContext();
  return true;
}

function hasModuleWorkers() {
  let supported = false;
  try {
    const worker = new Worker('data:,', {
      get type() {
        supported = true;
        return 'module';
      },
    });
    worker.terminate();
  } catch (e) {
    // the getter has already run when the browser reads the options
  }
  return supported;
}

function hasClassStaticBlocks() {
  try {
    new Function('class A { static {} }');
    return true;
  } catch (e) {
    return false;
  }
}

let supported;

export function isMapSupported() {
  if (supported === undefined) {
    supported = hasWebGL2() && hasModuleWorkers() && hasClassStaticBlocks();
  }
  return supported;
}
