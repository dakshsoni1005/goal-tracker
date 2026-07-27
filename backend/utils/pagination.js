/**
 * Helper to standardise and handle pagination for Mongoose queries.
 */
export const getPaginationResults = async (model, query, pageNum = 1, limitNum = 10, populateOptions = [], sortOptions = { createdAt: -1 }) => {
  const page = Math.max(1, parseInt(pageNum, 10) || 1);
  const limit = Math.max(1, parseInt(limitNum, 10) || 10);
  const skip = (page - 1) * limit;

  let dbQuery = model.find(query).sort(sortOptions).skip(skip).limit(limit);

  if (populateOptions && populateOptions.length > 0) {
    populateOptions.forEach((opt) => {
      dbQuery = dbQuery.populate(opt);
    });
  }

  const results = await dbQuery.exec();
  const total = await model.countDocuments(query);

  return {
    results,
    pagination: {
      total,
      limit,
      page,
      pages: Math.ceil(total / limit),
    },
  };
};
