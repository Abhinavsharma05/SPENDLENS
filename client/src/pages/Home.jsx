import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Stars } from '@react-three/drei';

function AnimatedBackground() {
  return (
    <div className="absolute inset-0 -z-10 bg-slate-950 overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 5, 2]} intensity={1} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
          <Sphere args={[1, 64, 64]} position={[-2, 1, -2]} scale={1.2}>
            <MeshDistortMaterial
              color="#3b82f6"
              attach="material"
              distort={0.5}
              speed={2}
              roughness={0.2}
            />
          </Sphere>
        </Float>
        
        <Float speed={1.5} rotationIntensity={2} floatIntensity={3}>
          <Sphere args={[1, 64, 64]} position={[2, -1, -1]} scale={0.8}>
            <MeshDistortMaterial
              color="#8b5cf6"
              attach="material"
              distort={0.4}
              speed={1.5}
              roughness={0.1}
            />
          </Sphere>
        </Float>
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/90 pointer-events-none" />
    </div>
  );
}

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-6 perspective-1000">
      <AnimatedBackground />

      <motion.div
        initial={{ opacity: 0, y: 50, rotateX: 20 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-center max-w-4xl mx-auto z-10 preserve-3d"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="inline-block mb-4 px-4 py-1.5 rounded-full glass-panel text-sm font-medium text-blue-300 border-blue-500/30"
        >
          Credex • SpendLens
        </motion.div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          Stop overpaying for <br />
          <span className="text-gradient">AI Infrastructure</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          The Mint for AI tool spend. Instantly audit your startup's AI subscriptions—Cursor, Claude, ChatGPT, and more—to discover downgrades, alternatives, and thousands in annual savings.
        </p>

        <motion.div
          whileHover={{ scale: 1.05, translateZ: 20 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block preserve-3d"
        >
          <Link
            to="/audit"
            className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white bg-blue-600 rounded-xl overflow-hidden transition-all hover:bg-blue-500 hover:shadow-[0_0_40px_rgba(59,130,246,0.6)]"
          >
            <span className="relative z-10 flex items-center gap-2 text-lg">
              Start Free Audit
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
        </motion.div>
      </motion.div>

      {/* 3D Floating Cards Preview */}
      <div className="absolute bottom-10 left-10 hidden lg:block perspective-1000">
        <motion.div 
          animate={{ y: [0, -20, 0], rotateY: [0, 10, 0], rotateX: [20, 30, 20] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="glass-panel p-4 rounded-2xl w-64 transform rotate-y-12 rotate-x-12"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold">C</div>
            <div className="font-semibold">Claude Pro</div>
          </div>
          <div className="text-red-400 text-sm">Overpaying by $240/yr</div>
        </motion.div>
      </div>

      <div className="absolute top-20 right-10 hidden lg:block perspective-1000">
        <motion.div 
          animate={{ y: [0, 20, 0], rotateY: [0, -10, 0], rotateX: [-10, 0, -10] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
          className="glass-panel p-4 rounded-2xl w-64 transform -rotate-y-12 -rotate-x-12"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">Gt</div>
            <div className="font-semibold">Cursor Business</div>
          </div>
          <div className="text-emerald-400 text-sm">Downgrade to Pro available</div>
        </motion.div>
      </div>
    </main>
  );
}
