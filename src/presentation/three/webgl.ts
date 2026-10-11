/** True when a WebGL context can be created; probed once so the 3D safe never crashes the page. */
export const supportsWebGL = (): boolean => {
  try {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('webgl2') ?? canvas.getContext('webgl')
    context?.getExtension('WEBGL_lose_context')?.loseContext()
    return context !== null
  } catch {
    return false
  }
}
