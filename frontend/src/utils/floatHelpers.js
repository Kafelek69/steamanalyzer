export function getConditionFromFloat(float) {
    if (float == null || isNaN(float) || float === '') return '';
    const num = Number(float);
    if (num >= 0.00 && num < 0.07) return 'Factory New';
    if (num >= 0.07 && num < 0.15) return 'Minimal Wear';
    if (num >= 0.15 && num < 0.38) return 'Field-Tested';
    if (num >= 0.38 && num < 0.45) return 'Well-Worn';
    return 'Battle-Scarred';
}

export function formatItemNameWithCondition(baseName, float) {
    const condition = getConditionFromFloat(float);
    if (!condition) return baseName;
    let cleanName = baseName.replace(/\s*\((Factory New|Minimal Wear|Field-Tested|Well-Worn|Battle-Scarred)\)/i, '');
    return cleanName + ' (' + condition + ')';
}
