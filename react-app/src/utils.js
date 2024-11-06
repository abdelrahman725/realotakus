export const getQuestionids = () => {
  const ids = JSON.parse(localStorage.getItem("questions"));
  return ids ? new Set(ids) : new Set();
};

export const updateQuestionids = (new_ids) => {
  const ids = getQuestionids();
  if (ids.length > 100_000) {
    return;
  }
  new_ids.forEach((id) => ids.add(id));
  localStorage.setItem("questions", JSON.stringify([...ids]));
};
