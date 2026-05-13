import mongoose from 'mongoose';

/**
 * Safely compare two ObjectIds or strings
 * Handles both ObjectId instances and string representations
 */
export const compareObjectIds = (id1: any, id2: any): boolean => {
  if (!id1 || !id2) return false;
  
  const str1 = id1.toString();
  const str2 = id2.toString();
  
  return str1 === str2;
};

/**
 * Convert ObjectId or string to string safely
 */
export const toObjectIdString = (id: mongoose.Types.ObjectId | string | undefined): string | null => {
  if (!id) return null;
  return typeof id === 'string' ? id : id.toString();
};

