"""ticket metadata pipeline"""

from haystack import Pipeline, SuperComponent
from haystack.components.builders import PromptBuilder

from src.assistant.components.base_llm import get_base_llm
from src.assistant.prompts.ticket_to_schema import ticket_to_schema_prompt


def get_ticket_metadata_extractor_pipeline(
    template: str = ticket_to_schema_prompt,
) -> Pipeline:
    """This is a pipeline that will be turned into a `SuperComponent`.
    It returns the query and its category, defined in the prompt.
    :param template: the jinja template of the prompt
    """

    prompt_builder = PromptBuilder(template=template, required_variables=["ticket"])
    pipe = Pipeline()
    pipe.add_component("prompt", prompt_builder)
    pipe.add_component("llm", get_base_llm())
    pipe.connect("prompt.prompt", "llm.prompt")
    return pipe
