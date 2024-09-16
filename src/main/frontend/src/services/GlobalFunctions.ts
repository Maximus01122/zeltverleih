import {Material, PlatzMaterial, BookingMaterial, MaterialAvailability} from "@/model/AllTypes";
export default class GlobalFunctions {

    public static findInListById(iterable:PlatzMaterial[], id:number): PlatzMaterial|undefined{
        let material = undefined;
        iterable.forEach(b => {if(b.material.id == id) {
            material = b;}})
        return material;
    }

    public static findInListById2(iterable:BookingMaterial[], id:number): BookingMaterial|undefined{
        let material = undefined;
        iterable.forEach(b => {if(b.material.id == id) {
            material = b;}})
        return material;
    }

    public static getDifference(list1:PlatzMaterial[], list2:PlatzMaterial[]):PlatzMaterial[]{
        let additionalOrder:PlatzMaterial[] = []
        list1.forEach(pmNeu => {
            list2.forEach(pmAlt => {
                if (pmNeu.material.id === pmAlt.material.id &&
                    pmNeu.material.count === pmAlt.material.count &&
                    pmNeu.material.name === pmAlt.material.name) {
                    if(pmNeu.count!=pmAlt.count){
                        let anzahl: number = pmNeu.count - pmAlt.count
                        additionalOrder.push({material:pmNeu.material, count:anzahl})
                    }
                }
            })
        })
        return additionalOrder;
    }

    public static getElementsToDelete(list1:PlatzMaterial[], list2:PlatzMaterial[]):PlatzMaterial[]{
        let additionalOrder:PlatzMaterial[] = []
        list1.forEach(pmNeu => {
            list2.forEach(pmAlt => {
                if (pmNeu.material.id === pmAlt.material.id &&
                    pmNeu.material.count === pmAlt.material.count &&
                    pmNeu.material.name === pmAlt.material.name) {
                    if(pmNeu.count == 0){
                        additionalOrder.push({material:pmNeu.material, count:0, id:pmAlt.id})
                    }
                }
            })
        })
        return additionalOrder;
    }


    static getIdFromBuchungsMaterial(platzmaterial: PlatzMaterial, bestellungOrginal: BookingMaterial[]):number {
        let id:number = 0;
        bestellungOrginal.forEach(bm => {
            if(bm.material.id == platzmaterial.material.id) {
                id = bm.id!;
            }
        })
        return id;
    }
}
