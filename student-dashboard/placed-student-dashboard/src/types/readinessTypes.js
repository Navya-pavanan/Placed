/**
 * @typedef {Object} SkillScore
 * @property {string} name - Skill or subject area name
 * @property {number} score - Current student score (0-100)
 * @property {number} target - Target score benchmark (0-100)
 * @property {string} iconName - Icon identifier
 * @property {string} color - Theme color key
 */

/**
 * @typedef {Object} ReadinessTier
 * @property {number} min - Minimum score threshold
 * @property {string} label - Tier title (e.g. Super Coder)
 * @property {string} color - Hex text color
 * @property {string} bg - Hex background color
 */

/**
 * @typedef {Object} CorporateRoleFit
 * @property {string} id - Unique role fit identifier
 * @property {string} title - Target corporate role title
 * @property {number} fitPercentage - Matching fit score (0-100)
 * @property {string} color - Color code for progress bar
 * @property {string} description - Feedback/recommendation summary
 * @property {boolean} [active] - Whether highlighted as primary target
 */

/**
 * @typedef {Object} SkillGapDeficit
 * @property {string} name - Skill or topic area
 * @property {number} currentScore - Current student performance
 * @property {number} targetScore - Industry/Placement target benchmark
 * @property {number} gap - Deficit difference (currentScore - targetScore)
 * @property {'red' | 'amber' | 'blue'} priorityClass - Visual priority tag
 * @property {string} priorityText - Status text label
 */
