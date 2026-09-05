import { collection, addDoc, doc, setDoc, getDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { getFirebaseDb } from './config';
import { UserProfile } from '@/types';

/**
 * Saves or registers a new Kiosk visitor (Name, Age, Age Group, Timestamp) to Firestore.
 */
export async function saveKioskUser(
  name: string,
  age: number,
  ageGroup?: string
): Promise<boolean> {
  const db = getFirebaseDb();
  if (!db) {
    console.log('[Firebase Offline] User registered locally.');
    return false;
  }

  try {
    const usersCol = collection(db, 'kiosk_users');
    await addDoc(usersCol, {
      name,
      age,
      ageGroup: ageGroup || (age < 13 ? '7-12' : age < 18 ? '13-17' : age < 25 ? '18-24' : '25-35'),
      registeredAt: serverTimestamp(),
      platform: 'Muqimiy Kiosk Kokand',
    });
    console.log('[Firebase] User registered successfully in Firestore!');
    return true;
  } catch (error) {
    console.warn('[Firebase] Error saving user to Firestore:', error);
    return false;
  }
}

/**
 * Saves a completed Kiosk user survey result to Firestore.
 */
export async function saveKioskSurveyResult(
  user: UserProfile | null,
  answers: Record<string, string>
): Promise<boolean> {
  const db = getFirebaseDb();
  if (!db) {
    console.log('[Firebase Offline] Survey saved locally.');
    return false;
  }

  try {
    const surveysCol = collection(db, 'kiosk_surveys');
    await addDoc(surveysCol, {
      userName: user?.name || 'Foydalanuvchi',
      userAge: user?.age || null,
      userAgeGroup: user?.ageGroup || '18-24',
      answers,
      createdAt: serverTimestamp(),
      platform: 'Muqimiy Kiosk Kokand',
    });
    console.log('[Firebase] Survey saved successfully to Firestore!');
    return true;
  } catch (error) {
    console.warn('[Firebase] Error saving survey to Firestore:', error);
    return false;
  }
}

/**
 * Tracks directional clicks (Language, Career, Migration, Psychology, AI).
 */
export async function trackDirectionClick(directionId: string): Promise<void> {
  const db = getFirebaseDb();
  if (!db) return;

  try {
    const statsDocRef = doc(db, 'kiosk_analytics', 'direction_clicks');
    await setDoc(
      statsDocRef,
      {
        [directionId]: increment(1),
        totalClicks: increment(1),
        lastUpdated: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.warn('[Firebase] Error tracking direction click:', error);
  }
}

/**
 * Saves user feedback to Firestore.
 */
export async function saveUserFeedback(feedback: {
  rating: number;
  comment?: string;
  category?: string;
  userName?: string;
}): Promise<boolean> {
  const db = getFirebaseDb();
  if (!db) return false;

  try {
    const feedbackCol = collection(db, 'kiosk_feedback');
    await addDoc(feedbackCol, {
      ...feedback,
      createdAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.warn('[Firebase] Error saving feedback:', error);
    return false;
  }
}
