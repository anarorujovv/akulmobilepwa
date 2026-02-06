import fetchModifications from "./fetchModifications";

const buildModificationsPayload = async (
    modifications,
    target
) => {

    let returnList = []

    let list = await fetchModifications(target)
    let targetModification = { ...modifications };

    for (let i = 0; i < list.length; i++) {
        if(targetModification[list[i].Column]){
            returnList.push(
                {
                    column:list[i].Column,
                    type:list[i].Type,
                    value:targetModification[list[i].Column]
                }
            )
        }
    }

    return [...returnList];

}

export default buildModificationsPayload;