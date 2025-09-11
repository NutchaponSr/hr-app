export const renderBelief = (belief: unknown) => {
  if (!belief) return null;

  if (Array.isArray(belief)) {
    return (
      <ul className="list-disc list-inside text-sm text-primary ml-2">
        {belief.map((item, index) => (
          <li key={index}>{String(item)}</li>
        ))}
      </ul>
    );
  }

  return <div className="text-sm text-primary ml-2">{String(belief)}</div>;
};