import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Html, Center } from "@react-three/drei";
import { GLTFLoader } from "three-stdlib";
import { OBJLoader } from "three-stdlib";
import { Suspense } from "react";

// Custom loader (centered inside container)
function InlineLoader({ message = "Loading 3D model..." }) {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full border-t-4 border-blue-500 h-12 w-12"></div>
        <p className="mt-2 text-sm text-white">{message}</p>
      </div>
    </Html>
  );
}

function GlbModel({ url }) {
  const gltf = useLoader(GLTFLoader, url);
  return (
    <Center>
      <primitive object={gltf.scene} />
    </Center>
  );
}

function ObjModel({ url }) {
  const obj = useLoader(OBJLoader, url);
  return (
    <Center>
      <primitive object={obj} />
    </Center>
  );
}

function ModelLoader({ url }) {
  if (!url) return null;
  const ext = url.split(".").pop().toLowerCase();

  if (ext === "glb" || ext === "gltf") return <GlbModel url={url} />;
  if (ext === "obj") return <ObjModel url={url} />;

  return (
    <Html center>
      <span className="text-red-500 font-medium bg-white/10 px-4 py-2 rounded-lg">
        ❌ Unsupported format: {ext}
      </span>
    </Html>
  );
}

export default function HybridViewer({ modelUrl }) {
  return (
    <div className="w-full h-full bg-stone-900 rounded-xl overflow-hidden relative">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <Suspense fallback={<InlineLoader />}>
          <ModelLoader url={modelUrl} />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  );
}
