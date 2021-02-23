import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import microConfig from "./mikro-orm.config";

const main = async () => {

    const orm = await MikroORM.init(microConfig);
    await orm.getMigrator().up();
    /*const post = orm.em.create(Post, {title: 'My First Post.'});
    await orm.em.persistAndFlush(post);*/

    //await orm.em.nativeInsert(Post, {title: 'My Second Post.'})

    /*const post = await orm.em.find(Post, {})
    console.log(post);*/
};

main().catch((err) => {
    console.log(err);
});
