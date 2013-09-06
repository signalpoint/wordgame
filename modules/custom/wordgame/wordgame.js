var wordgame = {
  settings:{
    case_sensitive:false
  }
};

var wordgame_answer = ''; // Holds the current answer.

/**
 * Implements hook_menu().
 */
function wordgame_menu() {
  var items = {
    play:{
      title:'Play Game',
      page_callback:'wordgame_play',
      pageshow:'wordgame_play_pageshow'
    }
  };
  return items;
}

/**
 * The page call back function for the play page.
 */
function wordgame_play() {
  var content = {
    /* Load word button */
    new_word:{
      theme:"button",
      text:"Load New Word",
      attributes:{
        onclick:"wordgame_load_new_word();"
      }
    },
    /* Word display container */
    word:{
      markup:'<div id="wordgame_word"></div>',
    },
    /* Player input form */
    player_input:{
      markup:drupalgap_get_form('wordgame_word_form')
    },
    /* Answer button */
    answer:{
      theme:'button',
      text:'View Answer',
      attributes:{
        onclick:"wordgame_view_answer();"
      }
    },
  };
  return content;
}

/**
 * The jQueryMobile pageshow call back function for the play page.
 */
function wordgame_play_pageshow() {
  wordgame_load_new_word();
}

/**
 * The player input form.
 */
function wordgame_word_form() {
  var form = {
    'id':'wordgame_word_form',
    'elements':{
      'translation':{
        'type':'textfield',
        'title':'Translation',
        'required':true,
      },
      'submit':{
        'type':'submit',
        'value':'Check My Answer',
      },
    },
  };
  return form;
}

/**
 * The player input form validation handler.
 */
function wordgame_word_form_validate(form, form_state) {
  // If the translation wasn't correct, set the form error.
  if (wordgame_answer.toLowerCase() != form_state.values.translation.toLowerCase()) {
    drupalgap_form_set_error('translation', 'Sorry, that is not correct!');
  }
}

/**
 * The player input form submission handler.
 */
function wordgame_word_form_submit(form, form_state) {
  // Their answer was correct, tell them about it, then load a new word.
  alert('Correct!');
  wordgame_load_new_word();
}

/**
 * Loads a new word from Drupal.
 */
function wordgame_load_new_word() {
  
  // Clear previous input.
  $('#edit-wordgame-word-form-translation').val('');
  
  // Grab a random word from the Drupal site translated view JSON page:
  //   http://language.tylerfrankenstein.com/vi/random-word
  //
  //   Note: the 'vi' is the language code for Vietnamese. Replace it
  //         with the language code for the language you would like to
  //        learn.
  drupalgap.views_datasource.call({
      path:'vi/random-word',
      success:function(data){
        if (data.nodes.length > 0) {
          // If there were any results, iterate over the collection.
          $.each(data.nodes, function(index, object){
              // Extract the node.
              var node = object.node;
              // Show the word to translate.
              $('div#wordgame_word').html(
                '<p>The word to translate is:</p>' + 
                '<p>' + node.title_translated + '</p>'
              );
              // Save the answer.
              wordgame_answer = node.title;
          });
        }
      }
  });

}

/**
 * Displays the current answer.
 */
function wordgame_view_answer() {
  if (wordgame_answer && wordgame_answer != '') {
    alert(wordgame_answer);
  }
}

