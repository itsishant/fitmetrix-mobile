import { DayWorkout } from "../types";

const IMG = {
  benchPress:
    "https://i.pinimg.com/originals/89/99/c2/8999c26a58939e04c515b6eb2811e972.gif",
  inclinePress:
    "https://i.pinimg.com/originals/79/fc/b4/79fcb42a0bc10816392f6d2ec84317bd.gif",
  cableFly:
    "https://i.pinimg.com/originals/3c/00/b9/3c00b9b4c3c73f2fccbf04ef36a6cfd3.gif",
  ropePushdown:
    "https://i.pinimg.com/originals/4b/3b/fc/4b3bfc6b207bf61cdd0d7786ebbfbaf7.gif",
  overheadExtension:
    "https://i.pinimg.com/originals/3b/cd/47/3bcd4700bfa8e0fd4eee4b1ca2d3c4c8.gif",
  dips: "https://i.pinimg.com/originals/c6/d9/c1/c6d9c10f22c64d0fb98d58d3bf8b9a8d.gif",
  latPulldown:
    "https://i.pinimg.com/originals/5f/94/dc/5f94dcede8fa403bd85ddb63b16ccadc.gif",
  seatedRow:
    "https://i.pinimg.com/originals/89/0c/c9/890cc9a7df1d00e4c3e30d5a68f64f05.gif",
  dbRow:
    "https://i.pinimg.com/originals/f1/20/c7/f120c761fec63509d4dc5e76a8556e46.gif",
  barbellCurl:
    "https://i.pinimg.com/originals/29/18/21/291821f42bb31c28f98f00da3a5d3050.gif",
  hammerCurl:
    "https://i.pinimg.com/originals/d2/95/c1/d295c1eaae2eaef219e9a56c4cd6206b.gif",
  squat:
    "https://i.pinimg.com/originals/ae/2b/a0/ae2ba0a1a5b4f95a1a9ece92c0c1eddb.gif",
  legCurl:
    "https://i.pinimg.com/originals/80/ee/ef/80eeef8cd101d9161e028d8f7b89d034.gif",
  legExtension:
    "https://i.pinimg.com/originals/8f/b4/d6/8fb4d6ac4a4ec7c7ff7dc0b0ae3e2fcd.gif",
  calfRaise:
    "https://i.pinimg.com/originals/d5/cd/39/d5cd39a920a1e34eebb2e7c95ca40e35.gif",
  hangingLegRaise:
    "https://i.pinimg.com/originals/25/93/7b/25937be8c40d3db1288c74e9d7788b3d.gif",
  cableCrunch:
    "https://i.pinimg.com/originals/31/10/da/3110da6a3c05e8ded12a4c25f932dcfe.gif",
  shoulderPress:
    "https://i.pinimg.com/originals/77/ca/76/77ca768dd82f68bbef8a7b7b70c94d38.gif",
  lateralRaise:
    "https://i.pinimg.com/originals/ae/94/97/ae9497c30bbe0a76f11e5e93a4f97523.gif",
  rearDeltFly:
    "https://i.pinimg.com/originals/a3/d6/29/a3d6296d4f47e2edcc50f5c2afd02821.gif",
  skullCrusher:
    "https://i.pinimg.com/originals/f8/68/16/f86816d6fe3a0772b92a08e1a7e9f919.gif",
  lunges:
    "https://i.pinimg.com/originals/db/68/e0/db68e00e7d1c2f7c1f62a27f6bfee7ed.gif",
  plank:
    "https://i.pinimg.com/originals/8b/b8/6c/8bb86c0d09deee45ff9fe66c1f3b838c.gif",
  russianTwist:
    "https://i.pinimg.com/originals/b0/f1/f6/b0f1f60fb08df6a47b4dc87d3ec71614.gif",
};

export const WORKOUT_DATA: DayWorkout[] = [
  {
    day: "Monday",
    muscle: "Chest + Triceps",
    exercises: [
      {
        id: "1",
        name: "Bench Press",
        sets: 4,
        reps: "8-10",
        image: IMG.benchPress,
        description: "Barbell chest press.",
      },
      {
        id: "2",
        name: "Incline DB Press",
        sets: 3,
        reps: "10-12",
        image: IMG.inclinePress,
        description: "Incline dumbbell chest press.",
      },
      {
        id: "3",
        name: "Cable / DB Fly",
        sets: 3,
        reps: "12-15",
        image: IMG.cableFly,
        description: "Controlled chest fly movement.",
      },
      {
        id: "4",
        name: "Rope Pushdown",
        sets: 3,
        reps: "12-15",
        image: IMG.ropePushdown,
        description: "Cable rope triceps pushdown.",
      },
      {
        id: "5",
        name: "Overhead DB Extension",
        sets: 3,
        reps: "10-12",
        image: IMG.overheadExtension,
        description: "Overhead dumbbell triceps extension.",
      },
      {
        id: "6",
        name: "Dips",
        sets: 2,
        reps: "Failure",
        image: IMG.dips,
        description: "Bodyweight dips to failure.",
      },
    ],
  },
  {
    day: "Tuesday",
    muscle: "Back + Biceps",
    exercises: [
      {
        id: "7",
        name: "Lat Pulldown / Pull-ups",
        sets: 4,
        reps: "10-12",
        image: IMG.latPulldown,
        description: "Vertical pulling movement.",
      },
      {
        id: "8",
        name: "Seated Cable Row",
        sets: 3,
        reps: "10-12",
        image: IMG.seatedRow,
        description: "Horizontal cable rowing.",
      },
      {
        id: "9",
        name: "One Arm DB Row",
        sets: 3,
        reps: "12",
        image: IMG.dbRow,
        description: "Single-arm dumbbell rowing.",
      },
      {
        id: "10",
        name: "Barbell Curl",
        sets: 3,
        reps: "10-12",
        image: IMG.barbellCurl,
        description: "Standing barbell biceps curl.",
      },
      {
        id: "11",
        name: "Incline DB Curl",
        sets: 3,
        reps: "12",
        image: IMG.hammerCurl,
        description: "Incline bench dumbbell curl.",
      },
      {
        id: "12",
        name: "Hammer Curl",
        sets: 2,
        reps: "12-15",
        image: IMG.hammerCurl,
        description: "Neutral-grip dumbbell curl.",
      },
    ],
  },
  {
    day: "Wednesday",
    muscle: "Legs + Abs",
    exercises: [
      {
        id: "13",
        name: "Squats / Leg Press",
        sets: 4,
        reps: "8-10",
        image: IMG.squat,
        description: "Primary lower-body compound lift.",
      },
      {
        id: "14",
        name: "Leg Curl",
        sets: 3,
        reps: "12",
        image: IMG.legCurl,
        description: "Hamstring isolation movement.",
      },
      {
        id: "15",
        name: "Leg Extension",
        sets: 3,
        reps: "12",
        image: IMG.legExtension,
        description: "Quadriceps isolation movement.",
      },
      {
        id: "16",
        name: "Standing Calf Raises",
        sets: 4,
        reps: "15-20",
        image: IMG.calfRaise,
        description: "Standing calf raises.",
      },
      {
        id: "17",
        name: "Hanging Leg Raise",
        sets: 3,
        reps: "12",
        image: IMG.hangingLegRaise,
        description: "Hanging core raise.",
      },
      {
        id: "18",
        name: "Cable Crunch",
        sets: 3,
        reps: "15",
        image: IMG.cableCrunch,
        description: "Weighted cable crunch.",
      },
    ],
  },
  {
    day: "Thursday",
    muscle: "Chest + Shoulders",
    exercises: [
      {
        id: "19",
        name: "Incline Bench Press",
        sets: 4,
        reps: "8-10",
        image: IMG.inclinePress,
        description: "Incline barbell chest press.",
      },
      {
        id: "20",
        name: "Flat DB Press",
        sets: 3,
        reps: "10-12",
        image: IMG.benchPress,
        description: "Flat dumbbell chest press.",
      },
      {
        id: "21",
        name: "DB Shoulder Press",
        sets: 3,
        reps: "10",
        image: IMG.shoulderPress,
        description: "Overhead dumbbell shoulder press.",
      },
      {
        id: "22",
        name: "Lateral Raises",
        sets: 4,
        reps: "12-15",
        image: IMG.lateralRaise,
        description: "Side-delt isolation raise.",
      },
      {
        id: "23",
        name: "Rear Delt Fly",
        sets: 3,
        reps: "15",
        image: IMG.rearDeltFly,
        description: "Rear-delt focused fly.",
      },
    ],
  },
  {
    day: "Friday",
    muscle: "Back + Arms",
    exercises: [
      {
        id: "24",
        name: "Wide Grip Lat Pulldown",
        sets: 4,
        reps: "10-12",
        image: IMG.latPulldown,
        description: "Wide-grip vertical pull.",
      },
      {
        id: "25",
        name: "Chest Supported Row / Machine Row",
        sets: 3,
        reps: "10-12",
        image: IMG.seatedRow,
        description: "Chest-supported horizontal row.",
      },
      {
        id: "26",
        name: "EZ Bar Curl",
        sets: 3,
        reps: "10",
        image: IMG.barbellCurl,
        description: "EZ-bar biceps curl.",
      },
      {
        id: "27",
        name: "Skull Crushers",
        sets: 3,
        reps: "10-12",
        image: IMG.skullCrusher,
        description: "Lying triceps extension.",
      },
      {
        id: "28",
        name: "Rope Hammer Curl",
        sets: 2,
        reps: "12",
        image: IMG.hammerCurl,
        description: "Cable rope hammer curl.",
      },
      {
        id: "29",
        name: "Rope Pushdown",
        sets: 2,
        reps: "12",
        image: IMG.ropePushdown,
        description: "Cable rope triceps pushdown.",
      },
    ],
  },
  {
    day: "Saturday",
    muscle: "Legs + Abs",
    exercises: [
      {
        id: "30",
        name: "Hack Squat / Goblet Squat",
        sets: 4,
        reps: "10",
        image: IMG.squat,
        description: "Squat variation as planned.",
      },
      {
        id: "31",
        name: "Leg Extension",
        sets: 3,
        reps: "12-15",
        image: IMG.legExtension,
        description: "Quadriceps isolation movement.",
      },
      {
        id: "32",
        name: "Leg Curls",
        sets: 3,
        reps: "12-15",
        image: IMG.legCurl,
        description: "Hamstring isolation movement.",
      },
      {
        id: "33",
        name: "Walking Lunges",
        sets: 3,
        reps: "12",
        image: IMG.lunges,
        description: "Walking lunge steps.",
      },
      {
        id: "34",
        name: "Seated Calf Raises",
        sets: 4,
        reps: "15-20",
        image: IMG.calfRaise,
        description: "Seated calf raise movement.",
      },
      {
        id: "35",
        name: "Plank",
        sets: 3,
        reps: "45-60 sec",
        image: IMG.plank,
        description: "Core plank hold.",
      },
      {
        id: "36",
        name: "Russian Twist",
        sets: 3,
        reps: "20",
        image: IMG.russianTwist,
        description: "Alternating oblique twists.",
      },
    ],
  },
];

export const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const getWorkoutByDay = (day: string): DayWorkout | undefined => {
  return WORKOUT_DATA.find((w) => w.day === day);
};
