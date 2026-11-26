// three の中で、shell と hero が実際に使う物だけを出す窓口（esbuild が使わない部分を落とせるように）。
// hero は THREE を引数で受け取るので、hero が three の新しい物を使う時はここに足す（tools/build.mjs が足りない名前を検査する）。
export {
  AdditiveBlending, BackSide, BoxGeometry, BufferAttribute, BufferGeometry, CanvasTexture,
  CapsuleGeometry, ClampToEdgeWrapping, Color, ConeGeometry, CylinderGeometry, DirectionalLight,
  DoubleSide, DynamicDrawUsage, Euler, ExtrudeGeometry, Group, HemisphereLight,
  InstancedBufferAttribute, InstancedMesh, Matrix3, Matrix4, Mesh, MeshBasicMaterial,
  MeshLambertMaterial, MeshStandardMaterial, NoColorSpace, NoToneMapping, Object3D, Path,
  PerspectiveCamera, Plane, PlaneGeometry, Quaternion, Ray, Raycaster,
  RepeatWrapping, SRGBColorSpace, Scene, Shape, Sphere, SphereGeometry,
  Sprite, SpriteMaterial, Texture, TorusGeometry, Vector2, Vector3,
  WebGLRenderer,
} from '../vendor/three/three.module.js';
