<template>
  <q-page class="relative-position">
    <q-scroll-area class="absolute full-height full-width">
      <div class="q-py-lg q-px-md row items-end q-col-gutter-md">
        <div class="col">
          <q-input
            bottom-slots
            v-model="newQweetContent"
            placeholder="What's happening?"
            counter
            maxlength="280"
            autogrow
            class="new-qweet"
          >
            <template v-slot:before>
              <q-avatar size="xl">
                <img
                  src="https://yt3.googleusercontent.com/-CFTJHU7fEWb7BYEb6Jh9gm1EpetvVGQqtof0Rbh-VQRIznYYKJxCaqv_9HeBcmJmIsp2vOO9JU=s900-c-k-c0x00ffffff-no-rj"
                />
              </q-avatar>
            </template>
          </q-input>
        </div>

        <div class="col col-shrink">
          <q-btn
            @click="addNewQweet"
            color="primary"
            class="q-mb-md"
            label="Qweet"
            unelevated
            rounded
            no-caps
            :disable="!newQweetContent"
          />
        </div>
      </div>
      <q-separator size="10px" color="grey-2" class="divider" />

      <q-list separator>
        <transition-group
          appear
          enter-active-class="animated fadeIn slow"
          leave-active-class="animated fadeOut slow"
        >
          <q-item class="q-py-md" v-for="qweet in qweets" :key="qweet.id">
            <q-item-section avatar top>
              <q-avatar size="xl">
                <img
                  src="https://yt3.googleusercontent.com/-CFTJHU7fEWb7BYEb6Jh9gm1EpetvVGQqtof0Rbh-VQRIznYYKJxCaqv_9HeBcmJmIsp2vOO9JU=s900-c-k-c0x00ffffff-no-rj"
                />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-subtitle1"
                ><strong>Aang</strong>
                <span class="text-grey-7">
                  @avatar_aang <br class="lt-md" />&bull;
                  {{ relativeDate(qweet.date) }}
                </span>
              </q-item-label>

              <q-item-label class="qweet-content">
                {{ qweet.content }}
              </q-item-label>
              <div class="qweet-icons row justify-between q-mt-sm">
                <q-btn
                  flat
                  round
                  color="grey"
                  size="sm"
                  icon="fa-regular fa-comment"
                />
                <q-btn
                  flat
                  round
                  color="grey"
                  size="sm"
                  icon="fas fa-retweet"
                />
                <q-btn flat round color="grey" size="sm" icon="far fa-heart" />
                <q-btn
                  @click="deleteQweet(qweet)"
                  flat
                  round
                  color="grey"
                  size="sm"
                  icon="fas fa-trash"
                />
              </div>
            </q-item-section>
          </q-item>
        </transition-group>
      </q-list>
    </q-scroll-area>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { formatDistance } from "date-fns";
import db from "src/boot/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

export default defineComponent({
  name: "PageHome",

  data() {
    return {
      newQweetContent: "",
      qweets: [
        // {
        //   content:
        //     "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo tenetur corrupti modi magnam inventore totam fugiat voluptatibus accusantium ullam culpa. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium, recusandae?",
        //   date: 1698910629107,
        // },
        // {
        //   content:
        //     "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo tenetur corrupti modi magnam inventore totam fugiat voluptatibus accusantium ullam culpa. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium, recusandae?",
        //   date: 1698910622444,
        // },
      ],
    };
  },
  methods: {
    relativeDate(value) {
      return formatDistance(value, new Date());
    },

    async addNewQweet() {
      let myuuid = uuidv4();

      let newQweet = { content: this.newQweetContent, date: Date.now() };
      try {
        await setDoc(doc(db, "qweets", myuuid), newQweet);
      } catch (error) {
        console.log("Firebase error", error);
      }
      this.newQweetContent = "";
    },

    async deleteQweet(qweet) {
      console.log("Deleted -> ", qweet.date);
      try {
        await deleteDoc(doc(db, "qweets", qweet.id));
      } catch (error) {
        console.log("Delete error", error);
      }
    },
  },
  mounted() {
    const q = query(collection(db, "qweets"), orderBy("date"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        let qweetChange = change.doc.data();
        qweetChange.id = change.doc.id;
        if (change.type === "added") {
          console.log("New qweet: ", qweetChange);
          this.qweets.unshift(qweetChange);
        }
        if (change.type === "modified") {
          console.log("Modified qweet: ", qweetChange);
        }
        if (change.type === "removed") {
          console.log("Removed qweet: ", qweetChange);
          let idx = this.qweets.findIndex((item) => qweetChange.id === item.id);
          this.qweets.splice(idx, 1);
        }
      });
    });
  },
});
</script>

<style lang="sass">
.new-qweet
  textarea
    font-size: 19px
    line-height: 1.4 !important
.divider
  border-top: 1px solid
  border-bottom: 1px solid
  border-color: $grey-5
.qweet-content
  white-space: pre-line
.qweet-icons
  margin-left: -5px
</style>
