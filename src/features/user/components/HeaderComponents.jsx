import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faChartLine, faAward, faBullseye, faRocket, faFire } from '@fortawesome/free-solid-svg-icons';

export const TabNavigation = ({ activeTab, setActiveTab, tabs }) => (
 <div className="flex gap-2 border-t border-cyan-500/20 pt-4 overflow-x-auto">
 {tabs.map(tab => (
 <button
 key={tab.id}
 onClick={() => setActiveTab(tab.id)}
 className={`py-3 px-6 font-semibold transition-all duration-300 flex items-center gap-2 whitespace-nowrap border-b-2 ${
 activeTab === tab.id
 ? 'text-white border-b-blue-600'
 : 'text-slate-400 border-b-transparent hover:text-slate-300'
 }`}
 >
 {tab.id === 'profile' && <FontAwesomeIcon icon={faCheckCircle} />}
 {tab.id === 'dashboard' && <FontAwesomeIcon icon={faChartLine} />}
 {tab.id === 'progress' && <FontAwesomeIcon icon={faAward} />}
 {tab.label}
 </button>
 ))}
 </div>
);

export const ProfileHeader = ({ onSettingsClick }) => (
 <div className="flex items-center justify-between py-6 mb-4">
 <div className="flex items-center gap-4">
 <h1 className="text-4xl font-bold bg-linear-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
 Mi Perfil
 </h1>
 </div>
 <button
 onClick={onSettingsClick}
 className="p-3 hover:bg-cyan-500/20 rounded-xl transition-all duration-300 text-2xl hover:text-cyan-400 hover:scale-110"
 >
 ️
 </button>
 </div>
);

export const DashboardHeader = ({ onExamClick }) => (
 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
 <div>
 <h2 className="text-4xl font-bold text-white mb-2">
 <FontAwesomeIcon icon={faChartLine} className="text-cyan-400 mr-3" />
 Tu Tablero de Control
 </h2>
 <p className="text-slate-400">¡Vamos a conquistar 500 puntos! </p>
 </div>
 <button
 onClick={onExamClick}
 className="px-6 py-3 bg-linear-to-r from-red-600 to-pink-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-2"
 >
 <FontAwesomeIcon icon={faBullseye} />
 Simular Examen
 </button>
 </div>
);

export const ProgressHeader = () => (
 <h2 className="text-4xl font-bold mb-12 bg-linear-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
 Mi Progreso
 </h2>
);

export const SessionsHeader = () => (
 <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
 <FontAwesomeIcon icon={faRocket} className="text-blue-400" />
 Sesiones Recomendadas
 </h3>
);

export const ChallengesHeader = () => (
 <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
 <FontAwesomeIcon icon={faFire} className="text-orange-400" />
 Desafíos del Día
 </h3>
);
