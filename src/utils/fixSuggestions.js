export const FIX_TARGETS = {
    NAME: "name",
    PHONE: "phone",
    PHOTO: "photo",
    DOB: "dob",
    GENDER: "gender",
    PASSWORD: "password",
    SESSIONS: "sessions",
};

export const FIX_RULES = [
    {
        id: "add-photo",
        priority: 90,
        title: "Add profile photo",
        desc: "Make your account easier to recognize.",
        route: "/myaccount/profile",
        focus: FIX_TARGETS.PHOTO,
        when: (user) => !user?.photo,
    },
    {
        id: "add-phone",
        priority: 80,
        title: "Add phone number",
        desc: "Improve recovery and account security.",
        route: "/myaccount/profile",
        focus: FIX_TARGETS.PHONE,
        when: (user) => !user?.phone,
    },
    {
        id: "add-dob",
        priority: 50,
        title: "Add date of birth",
        desc: "Complete your basic profile information.",
        route: "/myaccount/profile",
        focus: FIX_TARGETS.DOB,
        when: (user) => !user?.dob,
    },
    {
        id: "add-gender",
        priority: 40,
        title: "Add gender",
        desc: "Complete your profile details.",
        route: "/myaccount/profile",
        focus: FIX_TARGETS.GENDER,
        when: (user) => !user?.gender,
    },
];

export function getFixSuggestions(user, limit = 4) {
    return FIX_RULES
        .filter((rule) => rule.when(user))
        .sort((a, b) => b.priority - a.priority)
        .slice(0, limit)
        .map((rule) => ({
            ...rule,
            to: `${rule.route}?focus=${encodeURIComponent(rule.focus)}`,
        }));
}
