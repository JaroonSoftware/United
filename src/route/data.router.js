import React from "react";
import { Route } from "react-router-dom";

import { Users, UsersAccess, UsersManage } from "../pages/users";
import { Items, ItemsAccess, ItemsManage } from "../pages/items";
import { Itemtype, ItemtypeAccess, ItemtypeManage } from "../pages/itemtype";
import { Unit, UnitAccess, UnitManage } from "../pages/unit";
import { Customer, CustomerAccess, CustomerManage } from "../pages/customers";
import { Kind, KindAccess, KindManage } from "../pages/kind";
import { Location, LocationAccess, LocationManage } from "../pages/location";
import { County, CountyAccess, CountyManage } from "../pages/county";
import { Brand, BrandAccess, BrandManage } from "../pages/brand";
import { Model, ModelAccess, ModelManage } from "../pages/model";
import { CarModel, CarModelAccess, CarModelManage} from "../pages/carmodel";
import { Supplier, SupplierAccess, SupplierManage } from "../pages/supplier";

export const DataRouter = (
  <>
    <Route path="/users/" exact element={<Users />}>
      <Route index element={<UsersAccess />} />
      <Route path="manage/:action" element={<UsersManage />} />
    </Route>

    <Route path="/items/" exact element={<Items />}>
      <Route index element={<ItemsAccess />} />
      <Route path="manage/:action" element={<ItemsManage />} />
    </Route>

    <Route path="/itemtype/" exact element={<Itemtype />}>
      <Route index element={<ItemtypeAccess />} />
      <Route path="manage/:action" element={<ItemtypeManage />} />
    </Route>

    <Route path="/unit/" exact element={<Unit />}>
      <Route index element={<UnitAccess />} />
      <Route path="manage/:action" element={<UnitManage />} />
    </Route>

    <Route path="/customers/" exact element={<Customer />}>
      <Route index element={<CustomerAccess />} />
      <Route path="manage/:action" element={<CustomerManage />} />
    </Route>

    <Route path="/supplier/" exact element={<Supplier />}>
      <Route index element={<SupplierAccess />} />
      <Route path="manage/:action" element={<SupplierManage />} />
    </Route>

    <Route path="/kind/" exact element={<Kind />}>
      <Route index element={<KindAccess />} />
      <Route path="manage/:action" element={<KindManage />} />
    </Route>


    <Route path="/location/" exact element={<Location />}>
      <Route index element={<LocationAccess />} />
      <Route path="manage/:action" element={<LocationManage />} />
    </Route>

    <Route path="/county/" exact element={<County />}>
      <Route index element={<CountyAccess />} />
      <Route path="manage/:action" element={<CountyManage />} />
    </Route>

    <Route path="/brand/" exact element={<Brand />}>
      <Route index element={<BrandAccess />} />
      <Route path="manage/:action" element={<BrandManage />} />
    </Route>

    <Route path="/model/" exact element={<Model />}>
      <Route index element={<ModelAccess />} />
      <Route path="manage/:action" element={<ModelManage />} />
    </Route>

    <Route path="/carmodel/" exact element={<CarModel />}>
      <Route index element={<CarModelAccess />} />
      <Route path="manage/:action" element={<CarModelManage />} />
    </Route>
  </>
);
