import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button.tsx';
import { Input } from '../components/ui/input.tsx';
import { Label } from '../components/ui/label.tsx';
import { useSession } from '../store/SessionContext.tsx';
import { generateRoomCode } from '../lib/generateRoomCode.ts';

interface FormErrors {
  name?: string;
  title?: string;
}

const CreateSession = (): JSX.Element => {
  const navigate = useNavigate();
  const { dispatch } = useSession();

  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [topicInput, setTopicInput] = useState('');
  const [topics, setTopics] = useState<string[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    const trimmedName = name.trim();
    const trimmedTitle = title.trim();
    if (!trimmedName) newErrors.name = 'Facilitator name is required';
    else if (trimmedName.length > 40) newErrors.name = 'Name must be 40 characters or fewer';
    if (!trimmedTitle) newErrors.title = 'Session title is required';
    else if (trimmedTitle.length > 80) newErrors.title = 'Title must be 80 characters or fewer';
    return newErrors;
  };

  const handleAddTopic = (): void => {
    const trimmed = topicInput.trim();
    if (!trimmed || trimmed.length > 120) return;
    setTopics((prev) => [...prev, trimmed]);
    setTopicInput('');
  };

  const handleRemoveTopic = (index: number): void => {
    setTopics((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTopicKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTopic();
    }
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const code = generateRoomCode();
    const facilitatorId = crypto.randomUUID();

    dispatch({
      type: 'create-session',
      payload: {
        sessionId: facilitatorId,
        code,
        title: title.trim(),
        facilitator: {
          id: facilitatorId,
          name: name.trim(),
          role: 'facilitator',
        },
        topics: topics,
      },
    });

    void navigate(`/session/${code}`);
  };

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold tracking-tight text-center">Create Session</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="facilitator-name">Facilitator name</Label>
            <Input
              id="facilitator-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              placeholder="Your name"
              maxLength={40}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="session-title">Session title</Label>
            <Input
              id="session-title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              placeholder="e.g. Q3 Planning"
              maxLength={80}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Topics (optional)</Label>
            <div className="flex gap-2">
              <Input
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                onKeyDown={handleTopicKeyDown}
                placeholder="Add a topic"
                maxLength={120}
                className="flex-1"
              />
              <Button type="button" variant="outline" onClick={handleAddTopic}>
                Add
              </Button>
            </div>
            {topics.length > 0 && (
              <ol className="space-y-1 mt-2">
                {topics.map((topic, index) => (
                  <li key={index} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
                    <span className="mr-2">{index + 1}. {topic}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTopic(index)}
                      className="text-muted-foreground hover:text-destructive shrink-0"
                      aria-label={`Remove topic: ${topic}`}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ol>
            )}
          </div>

          <Button type="submit" className="w-full" size="lg">
            Create session
          </Button>
        </form>
      </div>
    </main>
  );
};

export default CreateSession;
