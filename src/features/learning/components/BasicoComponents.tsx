import { Icon } from '@/shared/components/Icon';
import Link from 'next/link';

export const TopicItem = ({ topic, idx, subject }) => (
  <div className="flex items-start justify-between rounded-lg bg-slate-800/50 p-3 transition-colors hover:bg-slate-800">
    <div className="flex-1">
      <p className="font-semibold text-white">{topic.title}</p>
      <p className="text-sm text-slate-400">{topic.content}</p>
    </div>
    <div className="ml-4 flex items-center gap-3">
      <span className="rounded bg-slate-700/50 px-3 py-1 text-xs text-slate-300">
        {topic.duration}
      </span>
      <Link
        href={`/aprender/${subject}/basico/${idx}`}
        className="rounded bg-green-600 px-3 py-1 text-sm text-white transition-colors hover:bg-green-700"
      >
        Aprender
      </Link>
    </div>
  </div>
);

export const BasicoTopicsList = ({ topics, subject }) => (
  <div className="space-y-3 border-t border-slate-700 bg-slate-900/50 p-4">
    {topics.map((topic, idx) => (
      <TopicItem key={idx} topic={topic} idx={idx} subject={subject} />
    ))}
  </div>
);

export const SubjectButton = ({ subject, isExpanded, onClick, bgColor }) => (
  <button
    onClick={onClick}
    className={`flex w-full items-center justify-between p-4 ${
      isExpanded ? bgColor : 'hover:bg-slate-700/50'
    } transition-colors`}
  >
    <div className="flex items-center gap-3 text-left">
      <Icon
        name={subject.icon}
        size="xl"
        className={`text-xl ${subject.color}`}
      />
      <div>
        <h3 className="text-lg font-semibold text-white">{subject.name}</h3>
        <p className="text-xs text-slate-400">8 horas de contenido • 500 XP</p>
      </div>
    </div>
    <Icon
      name="chevron-down"
      className={`text-slate-400 transition-transform duration-300 ${
        isExpanded ? 'rotate-180' : ''
      }`}
    />
  </button>
);

export const SubjectCard = ({ subject, isExpanded, topics, onToggle }) => (
  <div className="overflow-hidden rounded-xl border border-slate-700">
    <SubjectButton
      subject={subject}
      isExpanded={isExpanded}
      onClick={onToggle}
      bgColor={subject.bgColor}
    />
    {isExpanded && <BasicoTopicsList topics={topics} subject={subject.id} />}
  </div>
);
