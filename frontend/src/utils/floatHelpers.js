export function getConditionFromFloat(float) {
    if (float == null || isNaN(float)) return '';
    if (float >= 0.00 && float < 0.07) return 'Factory New';
    if (float >= 0.07 && float < 0.15) return 'Minimal Wear';
    if (float >= 0.15 && float < 0.38) return 'Field-Tested';
    if (float >= 0.38 && float < 0.45) return 'Well-Worn';
    return 'Battle-Scarred';
}

export function formatItemNameWithCondition(baseName, float) {
    const condition = getConditionFromFloat(float);
    if (!condition) return baseName;
    let cleanName = baseName.replace(/\s*\((Factory New|Minimal Wear|Field-Tested|Well-Worn|Battle-Scarred)\)/i, '');
    return cleanName + ' (' + condition + ')';
}
