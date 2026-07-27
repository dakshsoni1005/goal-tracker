/**
 * Third-Party Integrations and Services Module
 * Put SMS APIs (Twilio), OAuth (Google, GitHub), and Push notification integrations here.
 */

export const mockExternalService = async (payload) => {
  console.log('[Services] Service invoked with payload: ', payload);
  return { success: true };
};
