import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../features/auth/useAuthStore";
import { motion } from "framer-motion";

export default function Home() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  return (
    <div className="min-h-screen w-full bg-[#fbfbfd] dark:bg-[#121212] text-[#1d1d1f] dark:text-gray-100 flex flex-col justify-center items-center overflow-hidden pt-20 relative selection:bg-emerald-200 selection:text-emerald-900 dark:selection:bg-emerald-500/30">
      
      {/* Organic / Grid Background for "Open Source Freedom" feel */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
         {/* Cyber/Grid pattern resembling networks */}
         <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.1]" style={{ backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
         
         {/* Glowing electric accents */}
         <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-emerald-400/20 dark:bg-emerald-500/10 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-teal-400/10 dark:bg-teal-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="text-center px-6 max-w-5xl w-full mx-auto relative z-10 flex flex-col items-center">
        
        {/* Anti-Corporate / Open Source Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[13px] font-semibold tracking-wide uppercase shadow-sm"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          100% Community Driven Data
        </motion.div>

        {/* Rebellious Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.95]"
        >
          Reclaim your
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500">
            independence.
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 text-xl md:text-[22px] text-[#86868b] dark:text-gray-400 font-medium max-w-3xl leading-relaxed"
        >
          Break free from closed ecosystems and corporate monopolies. 
          Discover, map, and book EV charging stations built on open-source infrastructure. <strong className="text-[#1d1d1f] dark:text-gray-200">No gatekeepers. Just the open road.</strong>
        </motion.p>

        {/* Call To Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 flex flex-col sm:flex-row gap-5 items-center justify-center w-full sm:w-auto"
        >
          {user ? (
            <>
              <button
                onClick={() => navigate("/map")}
                className="w-full sm:w-auto px-8 py-4 bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f] rounded-2xl font-bold text-[16px] hover:bg-black dark:hover:bg-gray-200 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/20"
              >
                Explore Open Map
              </button>
              <button
                onClick={() => navigate("/trip")}
                className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-transparent border-2 border-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-2xl font-bold text-[16px] hover:bg-emerald-50 dark:hover:border-emerald-400 transition-all hover:border-emerald-500 hover:-translate-y-1"
              >
                Plan a Free Journey
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/map")}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-bold text-[16px] hover:opacity-90 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/30 flex items-center justify-center gap-2"
              >
                Start Exploring
                 <span className="text-[20px] leading-none">🗺️</span>
              </button>
              <button
                onClick={() => navigate("/register")}
                className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-transparent border-2 border-gray-200 dark:border-gray-700 text-[#1d1d1f] dark:text-white rounded-2xl font-bold text-[16px] hover:border-[#1d1d1f] dark:hover:border-gray-500 transition-all hover:-translate-y-1"
              >
                Join the Network
              </button>
            </>
          )}
        </motion.div>
        
        {/* Core Values Feature Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl"
        >
           <div className="bg-white/80 dark:bg-white/5 backdrop-blur-md border border-gray-100 dark:border-white/10 p-8 rounded-[2rem] text-left hover:shadow-lg hover:border-emerald-500/30 dark:hover:border-emerald-500/50 transition-all">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center text-2xl mb-6">🌍</div>
              <h3 className="text-xl font-bold text-[#1d1d1f] dark:text-white mb-2 tracking-tight">OpenChargeMap Powered</h3>
              <p className="text-[14px] text-gray-500 dark:text-gray-400 leading-relaxed font-medium">We aggregate data from the global, public OpenChargeMap registry. No proprietary lock-ins, just raw community-sourced infrastructure.</p>
           </div>
           
           <div className="bg-white/80 dark:bg-white/5 backdrop-blur-md border border-gray-100 dark:border-white/10 p-8 rounded-[2rem] text-left hover:shadow-lg hover:border-emerald-500/30 dark:hover:border-emerald-500/50 transition-all">
              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 rounded-2xl flex items-center justify-center text-2xl mb-6">🛣️</div>
              <h3 className="text-xl font-bold text-[#1d1d1f] dark:text-white mb-2 tracking-tight">Open Source Routing</h3>
              <p className="text-[14px] text-gray-500 dark:text-gray-400 leading-relaxed font-medium">Our trip planning relies on the Open Source Routing Machine (OSRM). Bypass corporate navigation algorithms that sell your data.</p>
           </div>

           <div className="bg-white/80 dark:bg-white/5 backdrop-blur-md border border-gray-100 dark:border-white/10 p-8 rounded-[2rem] text-left hover:shadow-lg hover:border-emerald-500/30 dark:hover:border-emerald-500/50 transition-all">
              <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 rounded-2xl flex items-center justify-center text-2xl mb-6">⚡</div>
              <h3 className="text-xl font-bold text-[#1d1d1f] dark:text-white mb-2 tracking-tight">Zero-Greed Policies</h3>
              <p className="text-[14px] text-gray-500 dark:text-gray-400 leading-relaxed font-medium">We exist to accelerate the transition to sustainable energy. We do not enforce network biases, subscriptions, or dark patterns.</p>
           </div>

        </motion.div>

      </div>
    </div>
  );
}